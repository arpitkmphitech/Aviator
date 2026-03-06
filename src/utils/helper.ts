export const base64ToFile = (
  base64String: string,
  filename: string = "document"
): File | null => {
  if (!base64String) return null;
  const arr = base64String.split(",");
  const mimeMatch = arr[0].match(/:(.*?);/);
  const mime = mimeMatch ? mimeMatch[1] : "image/jpeg";
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  const extension = mime.split("/")[1] || "jpg";
  const fileName = `${filename}.${extension}`;

  return new File([u8arr], fileName, { type: mime });
};

export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};
