interface SkewTitleProps {
    children: string
}

export default function SkewTitle({ children }: SkewTitleProps) {
    return (
        <div className="skew-style-container shadow-2xl">
            <div className="bg-gray-500 p-4" >
                <h1 className="font-bold text-lg ml-4 text-white skew-style-text">{children}</h1>
            </div>
        </div>
    )
}