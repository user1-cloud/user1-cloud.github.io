import type { CollectionEntry } from 'astro:content';

type BlogPost = CollectionEntry<'blog'>;

/** Resolve dir1/dir2 from post frontmatter or fall back to path segments. */
export function resolveDirs(post: BlogPost): { dir1: string; dir2: string } {
  const parts = post.id.split('/');
  return {
    dir1: post.data.dir1 ?? (parts.length >= 2 ? parts[0] : ''),
    dir2: post.data.dir2 ?? (parts.length >= 3 ? parts[1] : ''),
  };
}
