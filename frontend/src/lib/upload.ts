import { fetchAPI } from "@/lib/api"

export async function uploadImage(file: any){
    const formData = new FormData()
    const signatureData = await fetchAPI('/upload')
    formData.append("file", file)
    formData.append("api_key", signatureData.api_key)
    formData.append("timestamp", signatureData.timestamp.toString())
    formData.append("signature", signatureData.signature)
    formData.append("folder", "images")

    const res = await fetch(`https://api.cloudinary.com/v1_1/${signatureData.cloud_name}/image/upload`,{
        method: "POST",
        body: formData
    })

    const data = await res.json()
    return data.secure_url
}