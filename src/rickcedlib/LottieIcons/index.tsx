import { LottieIcon } from './LottieIcon';

type LottieIconProps = {
    height?: string;
    width?: string;
    loop?: boolean;
    autoPlay?: boolean;
};

const LockLottieIcon = ({ ...props }: LottieIconProps) => {
    return <LottieIcon lottieSrc="/Lock Icon.json" {...props} />;
};

export { LockLottieIcon };
