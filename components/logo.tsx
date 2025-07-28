import Image from 'next/image';

export const Logo = () => {
    return (
        <div className='flex items-center gap-2'>

            <Image
                src="/assets/logo.svg"
                alt="Logo"
                width={96}
                height={96}
                priority
            />
        </div>
    )
}
