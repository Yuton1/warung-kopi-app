export const MAX_IMAGE_FILE_SIZE = 2 * 1024 * 1024

export const getImageFileError = (file) => {
  if (!file) {
    return 'Pilih file gambar terlebih dahulu.'
  }

  if (!file.type?.startsWith('image/')) {
    return 'File harus berupa gambar.'
  }

  if (file.size > MAX_IMAGE_FILE_SIZE) {
    return 'Ukuran gambar maksimal 2 MB.'
  }

  return ''
}

export const readImageFileAsDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = () => resolve(String(reader.result ?? ''))
    reader.onerror = () => reject(new Error('Gagal membaca file gambar'))
    reader.readAsDataURL(file)
  })
