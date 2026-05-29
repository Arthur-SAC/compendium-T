import sharp from "sharp";

// Compõe a imagem de cor (exportada pelo pdfimages) com sua máscara (smask, em cinza)
// num PNG RGBA com transparência, aparando as bordas vazias.
export async function comporComMascara(corPath: string, maskPath: string, saidaPath: string): Promise<void> {
  const cor = sharp(corPath).toColourspace("srgb");
  const { data, info } = await cor.raw().toBuffer({ resolveWithObject: true });
  const mask = await sharp(maskPath).resize(info.width, info.height).greyscale().raw().toBuffer();
  const rgba = Buffer.alloc(info.width * info.height * 4);
  for (let i = 0; i < info.width * info.height; i++) {
    rgba[i * 4 + 0] = data[i * info.channels + 0];
    rgba[i * 4 + 1] = data[i * info.channels + 1];
    rgba[i * 4 + 2] = data[i * info.channels + 2];
    rgba[i * 4 + 3] = mask[i];
  }
  await sharp(rgba, { raw: { width: info.width, height: info.height, channels: 4 } })
    .trim()
    .png()
    .toFile(saidaPath);
}
