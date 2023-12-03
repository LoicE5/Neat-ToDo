interface SkewTitleProps {
    children: string
}

export default function SkewTitle({ children }: SkewTitleProps) {
    return (
        <div className="skew-style-container">
            <div className="bg-gray-800 p-4" >
                <h1 className="font-bold text-lg ml-4 text-red-500 skew-style-text">{children}</h1>
            </div>
        </div>
    )
}