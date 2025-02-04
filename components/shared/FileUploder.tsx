'use client'

import { Dispatch, SetStateAction, useCallback } from "react"
import { useDropzone } from "@uploadthing/react";
import { generateClientDropzoneAccept } from "uploadthing/client";
import { convertFileToUrl } from "@/lib/utils"
import { Button } from "../ui/button"
import Image from 'next/image'

type FileUploadProps = {
    imageUrl: string,
    onFieldChange: (value: string) => void
    setFiles: Dispatch<SetStateAction<File[]>>
}

export function FileUploder({ imageUrl, onFieldChange, setFiles }: FileUploadProps) {

    const onDrop = useCallback((acceptedFiles: File[]) => {
        setFiles(acceptedFiles);
        onFieldChange(convertFileToUrl(acceptedFiles[0]))
    }, [setFiles, onFieldChange]);

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: generateClientDropzoneAccept(['image/*']),
    });

    return (
        <div className="flex-center bg-dark-3 flex h-72 cousor-pointer flex-col overflow-hidden rounded-xl bg-grey-50" {...getRootProps()}>
            <input {...getInputProps()} />

            {imageUrl ? (
                <div>
                    <Image src={imageUrl} alt="image" width={500} height={400} />
                </div>
            ) : (
                <div className="flex-center flex-col py-5 text-grey-500">
                    <Image src="/assets/icons/upload.svg" width={77} height={77} alt="file upload" />
                    <h3 className="mb-2 mt-2">Drag photo here</h3>
                    <p className="p-medium-12 mb-4">SVG, PNG, JPG</p>
                    <Button className="rounded-full" type="button" >
                        Select from computer
                    </Button>
                </div>
            )}

        </div>
    );
}
