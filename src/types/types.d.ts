interface ProfileType {
    id: string;
    name: string;
    width: number;
    height: number;
    imgSrc: string;
    gradeName: string;
}

interface ProfilesTypes {
    [key: string]: ProfileType;
}