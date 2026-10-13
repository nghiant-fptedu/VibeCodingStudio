/**
 * Lấy metadata thực tế (tiêu đề chính xác, tên kênh) của video YouTube từ public oEmbed endpoint
 * Không cần API key, hỗ trợ CORS 100%
 */
export async function fetchYouTubeMetadata(
  videoId: string
): Promise<{ title: string; curator: string } | null> {
  try {
    const url = `https://noembed.com/embed?url=https://www.youtube.com/watch?v=${encodeURIComponent(
      videoId
    )}`;
    const response = await fetch(url);
    if (!response.ok) return null;
    const data = await response.json();
    if (data.error || !data.title) return null;

    return {
      title: data.title,
      curator: data.author_name || 'YouTube Creator',
    };
  } catch (error) {
    console.warn('Lỗi lấy metadata YouTube qua oEmbed:', error);
    return null;
  }
}
