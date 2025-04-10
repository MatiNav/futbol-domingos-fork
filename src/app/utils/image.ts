export async function isImageUrl(url: string) {
  const response = await fetch(url);
  const contentType = response.headers.get("content-type");
  return contentType?.startsWith("image/");
}
