
import { NextRequest, NextResponse } from "next/server";
import { Post, PostStatus } from "@/types/post";
import { getIsoTimestr } from "@/lib/time";
import { getUuid } from "@/lib/hash";
import { insertPost } from "@/models/post";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { secret, title, description, cover_url, images, video_url, is_paid, tags, locale } = body;

    // 1. Security Check
    const API_SECRET = process.env.API_SECRET;
    if (!API_SECRET || secret !== API_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!title || !cover_url) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // 2. Generate Slug
    let slug = title
      .toLowerCase()
      .trim()
      .replace(/[\u0300-\u036f]/g, '') // Remove accents if any
      .replace(/[^a-z0-9]+/g, "-") // Replace non-alphanumeric with hyphen
      .replace(/^-+|-+$/g, ""); // Trim leading/trailing hyphens
    
    // Append random string to ensure uniqueness if slug is too short or generic
    if (slug.length < 3) {
        slug = `post-${getUuid().slice(0, 8)}`;
    } else {
        slug += `-${getUuid().slice(0, 6)}`;
    }

    // 3. Construct Content (Markdown)
    let content = "";
    
    // Add description
    if (description) {
      content += `${description}\n\n`;
    }

    // Add Images (First 2 free, rest paid)
    if (images && Array.isArray(images)) {
      images.forEach((img: string, index: number) => {
        // After 2nd image, insert Paywall
        if (index === 2) {
          content += `\n<!--PAYWALL-->\n\n`;
        }
        content += `![Image ${index + 1}](${img})\n\n`;
      });
    }

    // Add Video (Always paid usually, assuming it comes after paywall or we force it)
    if (video_url) {
      // If paywall hasn't been added yet (e.g. few images), add it before video
      if (!content.includes("<!--PAYWALL-->")) {
        content += `\n<!--PAYWALL-->\n\n`;
      }
      content += `<video src="${video_url}" controls width="100%"></video>\n\n`;
    }

    // 4. Create Post Object
    const post: Post = {
      uuid: getUuid(),
      slug: slug,
      title: title,
      description: description || title,
      content: content,
      created_at: getIsoTimestr(),
      status: PostStatus.Online, // Auto publish
      cover_url: cover_url,
      author_name: "AutoBot", // Or configurable
      author_avatar_url: "/logo.png",
      locale: locale || "en",
      is_paid: is_paid !== undefined ? is_paid : true, // Default to paid
    };

    // 5. Save to DB
    await insertPost(post);

    return NextResponse.json({ success: true, slug: slug, url: `/posts/${slug}` });
  } catch (error: any) {
    console.error("Auto-post error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
