import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { put } from "@vercel/blob";

export type StoredFile = {
  fileName: string;
  filePath: string;
  fileType?: string;
  fileSize?: number;
};

export async function storeProjectFiles(projectId: string, files: File[]): Promise<StoredFile[]> {
  const validFiles = files.filter((file) => file && file.size > 0);
  if (!validFiles.length) return [];

  const useBlob = Boolean(process.env.BLOB_READ_WRITE_TOKEN);

  if (useBlob) {
    const uploaded = await Promise.all(
      validFiles.map(async (file) => {
        const blob = await put(`projects/${projectId}/${Date.now()}-${file.name.replace(/\s+/g, "-")}`, file, {
          access: "public",
          addRandomSuffix: true,
        });

        return {
          fileName: file.name,
          filePath: blob.url,
          fileType: file.type,
          fileSize: file.size,
        } satisfies StoredFile;
      }),
    );

    return uploaded;
  }

  const uploadDir = path.join(process.cwd(), "public", "uploads", "projects", projectId);
  await mkdir(uploadDir, { recursive: true });

  return Promise.all(
    validFiles.map(async (file) => {
      const buffer = Buffer.from(await file.arrayBuffer());
      const safeName = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
      const filePath = path.join(uploadDir, safeName);
      await writeFile(filePath, buffer);

      return {
        fileName: file.name,
        filePath: `/uploads/projects/${projectId}/${safeName}`,
        fileType: file.type,
        fileSize: file.size,
      } satisfies StoredFile;
    }),
  );
}
