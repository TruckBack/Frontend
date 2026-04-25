import { Button } from "@mui/material";
import { Google as GoogleIcon, Facebook as FacebookIcon } from "@mui/icons-material";
import { titleCase } from "title-case";
import type { AccountRole } from "../services/types";


interface OAuthButtonProps {
    platform: 'google' | 'facebook';
    loading: boolean;
    onClick: () => void;
    roleLabel?: AccountRole;

}

const platformIcons = {
    google: <GoogleIcon />,
    facebook: <FacebookIcon />,
};

const OAuthButton = ({ platform, loading, onClick, roleLabel }: OAuthButtonProps) => {
    return (
        <Button
            fullWidth
            variant="outlined"
            startIcon={platformIcons[platform]}
            onClick={onClick}
            disabled={loading}
            sx={{ py: 1.5 }}
        >
            Continue with {titleCase(platform)}{roleLabel ? ` as ${titleCase(roleLabel)}` : ''}
        </Button>
    );
};

export default OAuthButton;