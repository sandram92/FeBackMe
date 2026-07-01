export type AuthUser = {
    _id: string;
    googleId: string;
    credits: number;
};

export type AuthState = AuthUser | false | null;

export type RootState = {
    auth: AuthState;
};

export type AuthProps = {
    auth: AuthState;
};
