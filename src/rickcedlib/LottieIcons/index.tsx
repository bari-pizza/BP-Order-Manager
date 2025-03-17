import { LottieIcon } from './LottieIcon';
import AdminShieldIcon from '../../assets/lottie-icons/Admin Shield Icon.json';
import CarIcon from '../../assets/lottie-icons/Car Icon.json';
import ChartIcon from '../../assets/lottie-icons/Chart Icon.json';
import CreditCardIcon from '../../assets/lottie-icons/Credit Card Icon.json';
import DesktopIcon from '../../assets/lottie-icons/Desktop Icon.json';
import GlobeIcon from '../../assets/lottie-icons/Globe Icon.json';
import HelpIcon from '../../assets/lottie-icons/Help Icon.json';
import HomeIcon from '../../assets/lottie-icons/Home Icon.json';
import IncomeIcon from '../../assets/lottie-icons/Income Icon.json';
import LockIcon from '../../assets/lottie-icons/Lock Icon.json';
import MarketPlaceIcon from '../../assets/lottie-icons/Marketplace Icon.json';
import ManagerIcon from '../../assets/lottie-icons/Manager Icon.json';
import MenuIcon from '../../assets/lottie-icons/Menu Icon.json';
import MobileIcon from '../../assets/lottie-icons/Mobile Icon.json';
import OrderHistoryIcon from '../../assets/lottie-icons/Order History Icon.json';
import PickupIcon from '../../assets/lottie-icons/Pickup Icon.json';
import RegisterIcon from '../../assets/lottie-icons/Register Icon.json';
import RoundIcon from '../../assets/lottie-icons/Round Icon.json';
import SaveIcon from '../../assets/lottie-icons/Save Icon.json';
import SearchIcon from '../../assets/lottie-icons/Search Icon.json';
import SettingsIcon from '../../assets/lottie-icons/Settings Icon.json';
import StaffIcon from '../../assets/lottie-icons/Staff Icon.json';
import ThirdPartyIcon from '../../assets/lottie-icons/Third Party Icon.json';
import TimeIcon from '../../assets/lottie-icons/Time Icon.json';
import UnlockIcon from '../../assets/lottie-icons/Unlock Icon.json';
import UploadIcon from '../../assets/lottie-icons/Upload Icon.json';
import UserProfileIcon from '../../assets/lottie-icons/User Profile Icon.json';
import { copyAndCleanLottie, urlToRoundedBase64 } from '../../utils';
import { useQuery } from '@tanstack/react-query';

type LottieIconProps = {
    height?: string;
    width?: string;
    loop?: boolean;
    autoPlay?: boolean;
    className?: string;
};

export const AdminShieldLottieIcon = ({ ...props }: LottieIconProps) => {
    return <LottieIcon lottieSrc={AdminShieldIcon} {...props} />;
};

export const CarLottieIcon = ({ ...props }: LottieIconProps) => {
    return <LottieIcon lottieSrc={CarIcon} {...props} />;
};

export const ChartLottieIcon = ({ ...props }: LottieIconProps) => {
    return <LottieIcon lottieSrc={ChartIcon} {...props} />;
};

export const CreditCardLottieIcon = ({ ...props }: LottieIconProps) => {
    return <LottieIcon lottieSrc={CreditCardIcon} {...props} />;
};

export const DesktopLottieIcon = ({ ...props }: LottieIconProps) => {
    return <LottieIcon lottieSrc={DesktopIcon} {...props} />;
};

export const GlobeLottieIcon = ({ ...props }: LottieIconProps) => {
    return <LottieIcon lottieSrc={GlobeIcon} {...props} />;
};

export const HelpLottieIcon = ({ ...props }: LottieIconProps) => {
    return <LottieIcon lottieSrc={HelpIcon} {...props} />;
};

export const HomeLottieIcon = ({ ...props }: LottieIconProps) => {
    return <LottieIcon lottieSrc={HomeIcon} {...props} />;
};

export const IncomeLottieIcon = ({ ...props }: LottieIconProps) => {
    return <LottieIcon lottieSrc={IncomeIcon} {...props} />;
};

export const LockLottieIcon = ({ ...props }: LottieIconProps) => {
    return <LottieIcon lottieSrc={LockIcon} {...props} />;
};

export const MarketPlaceLottieIcon = ({ ...props }: LottieIconProps) => {
    return <LottieIcon lottieSrc={MarketPlaceIcon} {...props} />;
};

export const MenuLottieIcon = ({ ...props }: LottieIconProps) => {
    return <LottieIcon lottieSrc={MenuIcon} {...props} />;
};

export const MobileLottieIcon = ({ ...props }: LottieIconProps) => {
    return <LottieIcon lottieSrc={MobileIcon} {...props} />;
};

export const OrderHistoryLottieIcon = ({ ...props }: LottieIconProps) => {
    return <LottieIcon lottieSrc={OrderHistoryIcon} {...props} />;
};

export const RegisterLottieIcon = ({ ...props }: LottieIconProps) => {
    return <LottieIcon lottieSrc={RegisterIcon} {...props} />;
};

// with react query
export const RoundLottieIcon = ({ imageSrc, ...props }: LottieIconProps & { imageSrc?: string }) => {
    const queryKey = ['round-lottie-icon', imageSrc];
    const localStorageKey = `round-lottie-icon-${imageSrc}`;
    const { data: lottieData } = useQuery({
        queryKey: queryKey,
        queryFn: async () => {
            const cachedData = localStorage.getItem(localStorageKey);
            if (cachedData) {
                return JSON.parse(cachedData);
            }

            let updatedLottieData;
            if (!imageSrc) {
                updatedLottieData = copyAndCleanLottie(RoundIcon, 'Front Side', 'Front Side', 'it.1.c.k');
            } else {
                const base64 = await urlToRoundedBase64(imageSrc);
                updatedLottieData = copyAndCleanLottie(RoundIcon, 'Front Side', 'Front Side', 'it.1.c.k');
                // @ts-expect-error not worth the effort to write a type for lottiedata
                updatedLottieData.assets[0].p = base64;
            }

            localStorage.setItem(localStorageKey, JSON.stringify(updatedLottieData));
            return updatedLottieData;
        },
        staleTime: Infinity,
        enabled: true,
        gcTime: Infinity,
    });

    const { className, ...rest } = props;

    return (
        <LottieIcon
            loop={false}
            lottieSrc={lottieData as string}
            className={`lottie-round ${className || ''}`}
            playOnce
            {...rest}
        />
    );
};

export const PickupLottieIcon = ({ ...props }: LottieIconProps) => {
    return <LottieIcon lottieSrc={PickupIcon} {...props} />;
};

export const SaveLottieIcon = ({ ...props }: LottieIconProps) => {
    return <LottieIcon lottieSrc={SaveIcon} {...props} />;
};

export const SearchLottieIcon = ({ ...props }: LottieIconProps) => {
    return <LottieIcon lottieSrc={SearchIcon} {...props} />;
};

export const SettingsLottieIcon = ({ ...props }: LottieIconProps) => {
    return <LottieIcon lottieSrc={SettingsIcon} {...props} />;
};

export const StaffLottieIcon = ({ ...props }: LottieIconProps) => {
    return <LottieIcon lottieSrc={StaffIcon} {...props} />;
};

export const ManagerLottieIcon = ({ ...props }: LottieIconProps) => {
    return <LottieIcon lottieSrc={ManagerIcon} {...props} />;
};

export const ThirdPartyLottieIcon = ({ ...props }: LottieIconProps) => {
    return <LottieIcon lottieSrc={ThirdPartyIcon} {...props} />;
};

export const TimeLottieIcon = ({ ...props }: LottieIconProps) => {
    return <LottieIcon lottieSrc={TimeIcon} {...props} />;
};

export const UnlockLottieIcon = ({ ...props }: LottieIconProps) => {
    return <LottieIcon lottieSrc={UnlockIcon} {...props} />;
};

export const UploadLottieIcon = ({ ...props }: LottieIconProps) => {
    return <LottieIcon lottieSrc={UploadIcon} {...props} />;
};

export const UserProfileLottieIcon = ({ ...props }: LottieIconProps) => {
    return <LottieIcon lottieSrc={UserProfileIcon} {...props} />;
};
