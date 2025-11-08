import Link from "next/link";
import type { User } from "../../store/slices/authSlice";
import { SettingsIcon, LogoutIcon, LoginIcon } from "./Icons";
import styles from "./navbar.module.css";

interface UserActionsProps {
  user: User | null;
  onLogout: () => void;
  isMobile?: boolean;
  onMobileMenuClose?: () => void;
}

export default function UserActions({
  user,
  onLogout,
  isMobile = false,
  onMobileMenuClose,
}: UserActionsProps) {
  const handleLogout = () => {
    onLogout();
    if (onMobileMenuClose) {
      onMobileMenuClose();
    }
  };

  if (user) {
    const userAvatar = (
      <span className={styles.userAvatar}>
        {user.name?.charAt(0).toUpperCase()}
      </span>
    );

    const userName = (
      <span className={styles.userName}>
        {user.name}
      </span>
    );

    if (isMobile) {
      return (
        <>
          <div className={styles.mobileUserInfo}>
            {userAvatar}
            {userName}
          </div>
          <Link
            href="/admin/panel"
            className={styles.mobileAdminButton}
            onClick={onMobileMenuClose}
          >
            <SettingsIcon className={styles.buttonIcon} />
            Admin Panel
          </Link>
          <button onClick={handleLogout} className={styles.mobileLogoutButton}>
            <LogoutIcon className={styles.buttonIcon} />
            Logout
          </button>
        </>
      );
    }

    return (
      <>
        <div className={styles.userInfo}>
          {userAvatar}
          {userName}
        </div>
        <Link href="/admin/panel" className={styles.adminButton}>
          <SettingsIcon className={styles.buttonIcon} />
          Panel
        </Link>
        <button onClick={onLogout} className={styles.logoutButton}>
          <LogoutIcon className={styles.buttonIcon} />
          Logout
        </button>
      </>
    );
  }

  // Guest user - show login button
  if (isMobile) {
    return (
      <Link
        href="/admin/login"
        className={styles.mobileLoginButton}
        onClick={onMobileMenuClose}
      >
        <LoginIcon className={styles.buttonIcon} />
        Admin Login
      </Link>
    );
  }

  return (
    <Link href="/admin/login" className={styles.loginButton}>
      <LoginIcon className={styles.buttonIcon} />
      Admin Login
    </Link>
  );
}

