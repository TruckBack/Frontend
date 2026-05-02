import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CircularProgress,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import {
  CameraAltOutlined,
  LogoutOutlined,
  SaveOutlined,
} from "@mui/icons-material";
import { useAuth } from "../../contexts/AuthContext";
import PageHeader from "../../components/shared/PageHeader";
import { uploadService, resolveImageUrl } from "../../services/upload";
import { driverService } from "../../services/driver";
import { orderService } from "../../services/order";
import authService from "../../services/auth";
import type { DriverProfile as DriverProfileType } from "../../services/types";

const DriverProfile = () => {
  const { user, logout, updateUser } = useAuth();

  const [fullName, setFullName] = useState(user?.full_name ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    resolveImageUrl(user?.profile_image_url) ?? null,
  );
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const [vehicleType, setVehicleType] = useState("");
  const [vehiclePlate, setVehiclePlate] = useState("");
  const [vehicleCapacity, setVehicleCapacity] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [driverProfile, setDriverProfile] = useState<DriverProfileType | null>(
    null,
  );
  const [completedCount, setCompletedCount] = useState<number | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  const [savingProfile, setSavingProfile] = useState(false);
  const [savingVehicle, setSavingVehicle] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [vehicleSuccess, setVehicleSuccess] = useState(false);
  const [vehicleError, setVehicleError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const loadStats = async () => {
      setStatsLoading(true);
      try {
        const [profile, history] = await Promise.all([
          driverService.getMyProfile(),
          orderService.listOrderHistory(1, 0),
        ]);
        setDriverProfile(profile);
        setVehicleType(profile.vehicle_type);
        setVehiclePlate(profile.vehicle_plate);
        setVehicleCapacity(
          profile.vehicle_capacity_kg
            ? String(profile.vehicle_capacity_kg)
            : "",
        );
        setCompletedCount(history.total);
      } catch {
        // Stats unavailable — silently degrade
      } finally {
        setStatsLoading(false);
      }
    };
    loadStats();
  }, []);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleSaveProfile = async () => {
    setSavingProfile(true);
    setProfileError(null);
    setProfileSuccess(false);
    try {
      let profileImageUrl = user?.profile_image_url ?? null;
      if (avatarFile) {
        const { profile_image_url } =
          await uploadService.uploadProfileImage(avatarFile);
        profileImageUrl = profile_image_url;
        setAvatarPreview(resolveImageUrl(profile_image_url) ?? null);
        setAvatarFile(null);
      }
      await updateUser({
        full_name: fullName || null,
        phone: phone || null,
        profile_image_url: profileImageUrl,
      });
      setProfileSuccess(true);
    } catch (err) {
      setProfileError(
        err instanceof Error ? err.message : "Failed to save profile",
      );
    } finally {
      setSavingProfile(false);
    }
  };

  const handleSaveVehicle = async () => {
    setSavingVehicle(true);
    setVehicleError(null);
    setVehicleSuccess(false);
    try {
      const updated = await driverService.updateProfile({
        vehicle_type: vehicleType || null,
        vehicle_plate: vehiclePlate || null,
        vehicle_capacity_kg: vehicleCapacity ? Number(vehicleCapacity) : null,
      });
      setDriverProfile(updated);
      setVehicleSuccess(true);
    } catch (err) {
      setVehicleError(
        err instanceof Error ? err.message : "Failed to save vehicle info",
      );
    } finally {
      setSavingVehicle(false);
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }
    setSavingPassword(true);
    setPasswordError(null);
    setPasswordSuccess(false);
    try {
      await authService.changePassword(currentPassword, newPassword);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordSuccess(true);
    } catch (err) {
      setPasswordError(
        err instanceof Error ? err.message : "Failed to change password",
      );
    } finally {
      setSavingPassword(false);
    }
  };

  const avatarLetter = (
    user?.full_name?.[0] ??
    user?.email?.[0] ??
    "?"
  ).toUpperCase();
  const ratingValue = driverProfile?.rating ?? null;

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 680,
        mx: "auto",
        px: { xs: 2, sm: 3 },
        py: { xs: 2, sm: 3 },
        pb: { xs: 10, md: 3 },
      }}
    >
      <PageHeader title="Profile" subtitle="Manage your account settings" />

      <Stack spacing={2.5}>
        {/* Avatar */}
        <Stack alignItems="center">
          <Box sx={{ position: "relative" }}>
            <Avatar
              src={avatarPreview ?? undefined}
              sx={{ width: 80, height: 80, fontSize: 32 }}
            >
              {avatarLetter}
            </Avatar>
            <IconButton
              size="small"
              onClick={() => fileInputRef.current?.click()}
              sx={{
                position: "absolute",
                bottom: 0,
                right: 0,
                bgcolor: "background.paper",
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <CameraAltOutlined fontSize="small" />
            </IconButton>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              hidden
              onChange={handleAvatarChange}
            />
          </Box>
        </Stack>

        {/* Stats */}
        <Card sx={{ p: 2, borderRadius: 2 }}>
          <Stack spacing={1}>
            <Typography variant="subtitle2" fontWeight={600}>
              Delivery Statistics
            </Typography>
            {statsLoading ? (
              <CircularProgress size={20} sx={{ mx: "auto", my: 1 }} />
            ) : (
              <Stack direction="row" spacing={2}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="caption" color="text.secondary">
                    Completed
                  </Typography>
                  <Typography variant="h6" fontWeight={600}>
                    {completedCount ?? "—"}
                  </Typography>
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="caption" color="text.secondary">
                    Rating
                  </Typography>
                  {ratingValue !== null ? (
                    <Stack direction="row" alignItems="center" spacing={0.5}>
                      <Typography variant="h6" fontWeight={600}>
                        {ratingValue.toFixed(1)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        / 5
                      </Typography>
                    </Stack>
                  ) : (
                    <Typography variant="h6" fontWeight={600}>
                      —
                    </Typography>
                  )}
                </Box>
                {driverProfile?.license_number && (
                  <Box sx={{ flex: 2 }}>
                    <Typography variant="caption" color="text.secondary">
                      License
                    </Typography>
                    <Typography variant="body2" fontWeight={500}>
                      {driverProfile.license_number}
                    </Typography>
                  </Box>
                )}
              </Stack>
            )}
          </Stack>
        </Card>

        {/* Personal info */}
        <Card variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
          <Stack spacing={2}>
            <Typography variant="subtitle2" fontWeight={600}>
              Personal Information
            </Typography>
            {profileSuccess && (
              <Alert
                severity="success"
                onClose={() => setProfileSuccess(false)}
              >
                Profile updated successfully.
              </Alert>
            )}
            {profileError && (
              <Alert severity="error" onClose={() => setProfileError(null)}>
                {profileError}
              </Alert>
            )}
            <TextField
              label="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              size="small"
              fullWidth
              disabled={savingProfile}
            />
            <TextField
              label="Phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              size="small"
              fullWidth
              disabled={savingProfile}
            />
            <TextField
              label="Email"
              value={user?.email ?? ""}
              size="small"
              fullWidth
              disabled
            />
            <Button
              variant="contained"
              startIcon={
                savingProfile ? (
                  <CircularProgress size={16} color="inherit" />
                ) : (
                  <SaveOutlined />
                )
              }
              onClick={handleSaveProfile}
              disabled={savingProfile}
            >
              Save Changes
            </Button>
          </Stack>
        </Card>

        {/* Vehicle info */}
        <Card variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
          <Stack spacing={2}>
            <Typography variant="subtitle2" fontWeight={600}>
              Vehicle Information
            </Typography>
            {vehicleSuccess && (
              <Alert
                severity="success"
                onClose={() => setVehicleSuccess(false)}
              >
                Vehicle info updated successfully.
              </Alert>
            )}
            {vehicleError && (
              <Alert severity="error" onClose={() => setVehicleError(null)}>
                {vehicleError}
              </Alert>
            )}
            <TextField
              label="Vehicle Type"
              value={vehicleType}
              onChange={(e) => setVehicleType(e.target.value)}
              size="small"
              fullWidth
              disabled={savingVehicle || statsLoading}
              placeholder="e.g. Van, Truck"
            />
            <TextField
              label="Vehicle Plate"
              value={vehiclePlate}
              onChange={(e) => setVehiclePlate(e.target.value)}
              size="small"
              fullWidth
              disabled={savingVehicle || statsLoading}
            />
            <TextField
              label="Capacity (kg)"
              type="number"
              value={vehicleCapacity}
              onChange={(e) => setVehicleCapacity(e.target.value)}
              size="small"
              fullWidth
              disabled={savingVehicle || statsLoading}
            />
            <Button
              variant="contained"
              startIcon={
                savingVehicle ? (
                  <CircularProgress size={16} color="inherit" />
                ) : (
                  <SaveOutlined />
                )
              }
              onClick={handleSaveVehicle}
              disabled={savingVehicle || statsLoading}
            >
              Save Vehicle Info
            </Button>
          </Stack>
        </Card>

        {/* Password */}
        <Card variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
          <Stack spacing={2}>
            <Typography variant="subtitle2" fontWeight={600}>
              Change Password
            </Typography>
            {passwordSuccess && (
              <Alert
                severity="success"
                onClose={() => setPasswordSuccess(false)}
              >
                Password changed successfully.
              </Alert>
            )}
            {passwordError && (
              <Alert severity="error" onClose={() => setPasswordError(null)}>
                {passwordError}
              </Alert>
            )}
            <TextField
              label="Current Password"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              size="small"
              fullWidth
              autoComplete="current-password"
              disabled={savingPassword}
            />
            <TextField
              label="New Password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              size="small"
              fullWidth
              autoComplete="new-password"
              disabled={savingPassword}
            />
            <TextField
              label="Confirm New Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              size="small"
              fullWidth
              autoComplete="new-password"
              disabled={savingPassword}
            />
            <Button
              variant="outlined"
              startIcon={
                savingPassword ? (
                  <CircularProgress size={16} color="inherit" />
                ) : undefined
              }
              onClick={handleChangePassword}
              disabled={
                savingPassword ||
                !currentPassword ||
                !newPassword ||
                !confirmPassword
              }
            >
              Change Password
            </Button>
          </Stack>
        </Card>

        <Button
          variant="contained"
          color="error"
          fullWidth
          startIcon={<LogoutOutlined />}
          onClick={logout}
          sx={{ py: 1.5, borderRadius: 1 }}
        >
          Logout
        </Button>
      </Stack>
    </Box>
  );
};

export default DriverProfile;
