'use client'
import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession, signIn, signOut } from 'next-auth/react';
import { fetchDefaultImages } from '@/utils/api';
import Image from 'next/image';
import ActiveLink from './active.link';
import HomeIcon from '@mui/icons-material/Home';
import QueueMusicIcon from '@mui/icons-material/QueueMusic';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import LoginIcon from '@mui/icons-material/Login';


const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: theme.spacing(1),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(3),
        width: 'auto',
    },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width: '90%',
        [theme.breakpoints.up('md')]: {
            width: '300px',
        },
    },
}));

export default function AppHeader() {
    const { data: session } = useSession();

    const router = useRouter();
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [mobileMoreAnchorEl, setMobileMoreAnchorEl] =
        React.useState<null | HTMLElement>(null);

    const isMenuOpen = Boolean(anchorEl);
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

    const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMobileMenuClose = () => {
        setMobileMoreAnchorEl(null);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        handleMobileMenuClose();
    };

    const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setMobileMoreAnchorEl(event.currentTarget);
    };

    const menuId = 'primary-search-account-menu';
    const renderMenu = (
        <Menu
            anchorEl={anchorEl}

            id={menuId}
            keepMounted
            open={isMenuOpen}
            onClose={handleMenuClose}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
            <MenuItem>
                <Link href={`/profile/${session?.user?._id}`}
                    style={{
                        color: "unset",
                        textDecoration: "unset"
                    }}>
                    Profile
                </Link>
            </MenuItem>

            <MenuItem onClick={() => {
                handleMenuClose();
                signOut();
            }}>Logout</MenuItem>

        </Menu>
    );

    const mobileMenuId = 'primary-search-account-menu-mobile';
    const renderMobileMenu = (
        <Menu
            anchorEl={mobileMoreAnchorEl}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            id={mobileMenuId}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={isMobileMenuOpen}
            onClose={handleMobileMenuClose}
        >
            <MenuItem
                onClick={() => handleRedirectHome()}>
                <IconButton
                    size="large"
                    aria-label="show 17 new notifications"
                    color="inherit"
                    sx={{
                        color: "#FF5500"
                    }}
                >
                    <HomeIcon />
                </IconButton>
                Home
            </MenuItem>
            <MenuItem>
                <IconButton size="large" aria-label="show 4 new mails" color="inherit"
                    sx={{
                        color: "#FF5500"
                    }}>
                    <QueueMusicIcon />
                </IconButton>
                <Link href={`/playlist`}
                    style={{
                        color: "unset",
                        textDecoration: "unset"
                    }}>
                    Playlists
                </Link>
            </MenuItem>
            <MenuItem>
                <IconButton
                    size="large"
                    aria-label="show 17 new notifications"
                    color="inherit"
                    sx={{
                        color: "#FF5500"
                    }}
                >
                    <FavoriteIcon />
                </IconButton>
                <Link href={`/like`}
                    style={{
                        color: "unset",
                        textDecoration: "unset"
                    }}>
                    Likes
                </Link>
            </MenuItem>
            <MenuItem>
                <IconButton
                    size="large"
                    aria-label="show 17 new notifications"
                    color="inherit"
                    sx={{
                        color: "#FF5500"
                    }}
                >
                    <CloudUploadIcon />
                </IconButton>
                <Link href={`/track/upload`}
                    style={{
                        color: "unset",
                        textDecoration: "unset"
                    }}>
                    Upload
                </Link>
            </MenuItem>
            {session
                ?
                <>
                    <MenuItem onClick={handleProfileMenuOpen}>
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="primary-search-account-menu"
                            aria-haspopup="true"
                            color="inherit"
                            sx={{
                                color: "#FF5500"
                            }}
                        >
                            <AccountCircle />
                        </IconButton>
                        <p>Profile</p>
                    </MenuItem>
                </>
                :
                <>
                    <MenuItem>
                        <IconButton
                            size="large"
                            aria-label="show 17 new notifications"
                            color="inherit"
                            sx={{
                                color: "#FF5500"
                            }}
                        >
                            <LoginIcon />
                        </IconButton>
                        <Link href={`/auth/signin`}
                            style={{
                                color: "unset",
                                textDecoration: "unset"
                            }}>
                            Sign in
                        </Link>
                    </MenuItem>
                </>
            }
        </Menu>
    );

    const handleRedirectHome = () => {
        router.push("/")
    }

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static"
                sx={{
                    backgroundColor: "#3080a3"
                }}
            >
                <Container>
                    <Toolbar>
                        <Typography
                            variant="h5"
                            noWrap
                            component="div"
                            sx={{
                                fontWeight: "bold",
                                display: "block",
                                minWidth: "70px",
                                cursor: "pointer",
                                color: "#FF5500",
                                textOverflow: "unset"
                            }}
                            onClick={() => handleRedirectHome()}
                        >
                            SMusic
                        </Typography>
                        <Search>
                            <SearchIconWrapper>
                                <SearchIcon />
                            </SearchIconWrapper>
                            <StyledInputBase
                                placeholder="Search…"
                                inputProps={{ 'aria-label': 'search' }}
                                onKeyDown={(e: any) => {
                                    if (e.key === "Enter") {
                                        if (e?.target?.value) {
                                            router.push(`/search?q=${e?.target?.value}`)
                                        }
                                    }
                                }}
                            />
                        </Search>
                        <Box sx={{ flexGrow: 1 }} />
                        <Box sx={{
                            display: { xs: 'none', md: 'flex' },
                            gap: "20px",
                            alignItems: "center",
                            "> a ": {
                                color: "unset",
                                textDecoration: "unset",
                                padding: "5px",

                                "&.active": {
                                    background: "#3cbcc2",
                                    borderRadius: "5px"
                                }
                            }
                        }}>
                            {
                                session ?
                                    <>
                                        <ActiveLink href={"/playlist"}>Playlists</ActiveLink>
                                        <ActiveLink href={"/like"}>Likes</ActiveLink>
                                        <ActiveLink href={"/track/upload"}>Upload</ActiveLink>
                                        <Image
                                            onClick={handleProfileMenuOpen}
                                            src={fetchDefaultImages(session.user.type)}
                                            alt='avatar'
                                            height={35}
                                            width={35}
                                        />
                                    </>
                                    : <>
                                        <Link href={"/auth/signin"}>
                                            Login
                                        </Link>
                                    </>
                            }
                        </Box>
                        <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
                            <IconButton
                                size="large"
                                aria-label="show more"
                                aria-controls={mobileMenuId}
                                aria-haspopup="true"
                                onClick={handleMobileMenuOpen}
                                color="inherit">
                                <MenuIcon />
                            </IconButton>
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>
            {renderMobileMenu}
            {renderMenu}
        </Box>
    );
}
