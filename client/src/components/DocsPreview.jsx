import React from 'react'

const DocsPreview = ({ label, url }) => {
    const isImage = url?.match(/\.(jpg|jpeg|png|webp)$/i)
    const isPdf = url?.endsWith(".pdf")
    return (
        <div className='bg-background rounded-2xl border border-zinc-700 overflow-hidden shadow-sm'>
            <div className='px-4 py-2 border-b border-zinc-700 text-sm font-semibold'>
                {label}
            </div>
            <div className='h-52 flex items-center justify-center bg-background'>
                {
                    !url && <span className='text-xs text-gray-400'>Image Not Uploaded</span>
                }
                {
                    isImage && <img src={url} alt="" className='w-full h-full object-cover' />
                }
                {
                    isPdf && <iframe src={url} className='w-full h-full'></iframe>
                }
            </div>
                {
                    url && <a href={url} target='_blank'  className='block text-center text-xs py-2 font-medium hover:bg-zinc-800'>Open</a>
                }
        </div>

    )
}

export default DocsPreview