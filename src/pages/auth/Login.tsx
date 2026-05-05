import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Divider,
  InputAdornment,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import {
  BadgeOutlined,
  Google,
  EmailOutlined,
  LockOutlined,
  PersonOutline,
  LocalShippingOutlined,
  ConfirmationNumberOutlined,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
// GoogleOAuthProvider in App.tsx loads the GSI script, exposing window.google
import { useAuth } from "../../contexts/AuthContext";
import type { UserRole } from "../../services/types";
import { isAxiosError } from "axios";

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential: string }) => void;
            cancel_on_tap_outside?: boolean;
          }) => void;
          prompt: () => void;
        };
      };
    };
  }
}

type AuthMode = "login" | "register";
type FieldErrors = Record<string, string>;

const Login = () => {
  const [role, setRole] = useState<UserRole>("driver");
  const [modeType, setModeType] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const [vehiclePlate, setVehiclePlate] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [loading, setLoading] = useState(false);

  const { login, register, loginWithGoogleToken } = useAuth();
  const navigate = useNavigate();

  const handleRoleChange = (
    _event: React.MouseEvent<HTMLElement>,
    newRole: UserRole | null,
  ) => {
    if (!newRole) {
      return;
    }

    setRole(newRole);
    setError(null);
    setFieldErrors({});
  };

  const clearFormErrors = () => {
    if (error) setError(null);
    if (Object.keys(fieldErrors).length > 0) setFieldErrors({});
  };

  const clearFieldError = (field: string) => {
    if (fieldErrors[field]) {
      setFieldErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    clearFormErrors();
    setLoading(true);

    try {
      if (modeType === "login") {
        await login({ email, password, role });
      } else {
        const commonData = { email, password, full_name: fullName };
        if (role === "driver") {
          await register(
            {
              ...commonData,
              license_number: licenseNumber,
              vehicle_type: vehicleType,
              vehicle_plate: vehiclePlate,
            },
            role,
          );
        } else {
          await register(commonData, role);
        }
      }

      navigate("/");
    } catch (err) {
      if (
        isAxiosError(err) &&
        err.response?.data?.error?.code === "validation_error"
      ) {
        const details = err.response.data.error.details || [];
        const newFieldErrors: FieldErrors = {};
        details.forEach((detail: any) => {
          // The location array is like ["body", "password"]
          const fieldName = detail.loc[detail.loc.length - 1];
          // Map backend field names to frontend state names if they differ
          const fieldMap: Record<string, string> = {
            full_name: "fullName",
            license_number: "licenseNumber",
            vehicle_type: "vehicleType",
            vehicle_plate: "vehiclePlate",
          };
          const mappedField = fieldMap[fieldName] || fieldName;
          newFieldErrors[mappedField] = detail.msg;
        });
        setFieldErrors(newFieldErrors);
        setError("Please correct the errors below.");
      } else if (isAxiosError(err) && err.response?.status === 401) {
        setError("Invalid username or password");
      } else {
        setError(err instanceof Error ? err.message : "An error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    setError(null);
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID as string;
    if (!clientId || !window.google?.accounts?.id) {
      setError("Google sign-in is not available right now.");
      return;
    }
    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: async (credentialResponse) => {
        setLoading(true);
        try {
          await loginWithGoogleToken(credentialResponse.credential, role);
          navigate("/");
        } catch (err) {
          if (isAxiosError(err)) {
            if (err.response?.status === 401) {
              setError(
                "Google sign-in failed. Make sure you're using the correct account type.",
              );
            } else if (err.response?.status === 400) {
              setError("Google login is not available right now.");
            } else {
              setError(
                err.response?.data?.error?.message ?? "Google login failed",
              );
            }
          } else {
            setError(
              err instanceof Error ? err.message : "Google login failed",
            );
          }
        } finally {
          setLoading(false);
        }
      },
      cancel_on_tap_outside: false,
    });
    window.google.accounts.id.prompt();
  };

  const isFormValid = () => {
    if (modeType === "login") {
      return email && password;
    }
    // Registration
    if (!email || !password || !fullName) return false;
    if (role === "driver") {
      return licenseNumber && vehicleType && vehiclePlate;
    }
    return true;
  };

  return (
    <Box
      sx={(theme) => ({
        minHeight: "100dvh",
        display: "flex",
        boxSizing: "border-box",
        position: "relative",
        overflowX: "hidden",
        overflowY: "auto",
        justifyContent: "center",
        alignContent: "center",
        background:
          theme.palette.mode === "dark"
            ? "linear-gradient(180deg, #08111f 0%, #0d1728 45%, #111827 100%)"
            : "linear-gradient(180deg, #eff6ff 0%, #f8fafc 45%, #ffffff 100%)",
        px: { xs: 2, sm: 3, md: 4 },
      })}
    >
      <Stack
        paddingTop={0}
        sx={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          maxWidth: "430px",
          mx: "auto",
          minHeight: "100%",
          justifyContent: "center",
          py: { xs: 5, sm: 6 },
        }}
      >
        <Stack spacing={2.25}>
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="h5" component="h1" fontWeight={700}>
              Welcome to TruckBack
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
              {modeType === "login"
                ? "Login to continue"
                : "Register to continue"}
            </Typography>
          </Box>

          <ToggleButtonGroup
            value={role}
            exclusive
            onChange={handleRoleChange}
            fullWidth
            aria-label="account role"
            sx={{
              borderRadius: 3,
              p: 0.5,
              bgcolor: "action.hover",
              "& .MuiToggleButtonGroup-grouped": {
                border: 0,
                borderRadius: 2,
                py: 1.1,
                fontWeight: 600,
              },
            }}
          >
            <ToggleButton value="driver" aria-label="driver">
              Driver
            </ToggleButton>
            <ToggleButton value="customer" aria-label="customer">
              Customer
            </ToggleButton>
          </ToggleButtonGroup>

          <Button
            fullWidth
            variant="outlined"
            startIcon={<Google />}
            onClick={handleGoogleLogin}
            disabled={loading}
            sx={{
              py: 1.5,
              borderRadius: 2,
              fontWeight: 600,
            }}
          >
            Sign in with Google
          </Button>

          <Divider>
            <Typography variant="body2" color="text.secondary">
              Or continue with
            </Typography>
          </Divider>

          {error && (
            <Alert severity="error" onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={2}>
              <Box>
                <Typography variant="subtitle1" fontWeight={500} sx={{ mb: 1 }}>
                  Email
                </Typography>
                <TextField
                  fullWidth
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    clearFieldError("email");
                  }}
                  required
                  autoComplete="email"
                  disabled={loading}
                  error={!!fieldErrors.email}
                  helperText={fieldErrors.email}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailOutlined color="primary" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>

              <Box>
                <Typography variant="subtitle1" fontWeight={500} sx={{ mb: 1 }}>
                  Password
                </Typography>
                <TextField
                  fullWidth
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value);
                    clearFieldError("password");
                  }}
                  required
                  autoComplete={
                    modeType === "login" ? "current-password" : "new-password"
                  }
                  disabled={loading}
                  error={!!fieldErrors.password}
                  helperText={fieldErrors.password}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockOutlined color="primary" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>

              {modeType === "register" && (
                <>
                  <Box>
                    <Typography
                      variant="subtitle1"
                      fontWeight={500}
                      sx={{ mb: 1 }}
                    >
                      Full Name
                    </Typography>
                    <TextField
                      fullWidth
                      placeholder="Enter your full name"
                      value={fullName}
                      onChange={(event) => {
                        setFullName(event.target.value);
                        clearFieldError("fullName");
                      }}
                      required
                      autoComplete="name"
                      disabled={loading}
                      error={!!fieldErrors.fullName}
                      helperText={fieldErrors.fullName}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PersonOutline color="primary" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Box>
                  {role === "driver" && (
                    <>
                      <Box>
                        <Typography
                          variant="subtitle1"
                          fontWeight={500}
                          sx={{ mb: 1 }}
                        >
                          License Number
                        </Typography>
                        <TextField
                          fullWidth
                          placeholder="Enter your license number"
                          value={licenseNumber}
                          onChange={(event) => {
                            setLicenseNumber(event.target.value);
                            clearFieldError("licenseNumber");
                          }}
                          required
                          disabled={loading}
                          error={!!fieldErrors.licenseNumber}
                          helperText={fieldErrors.licenseNumber}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <BadgeOutlined color="primary" />
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Box>
                      <Box>
                        <Typography
                          variant="subtitle1"
                          fontWeight={500}
                          sx={{ mb: 1 }}
                        >
                          Vehicle Type
                        </Typography>
                        <TextField
                          fullWidth
                          placeholder="e.g., Van, Truck"
                          value={vehicleType}
                          onChange={(event) => {
                            setVehicleType(event.target.value);
                            clearFieldError("vehicleType");
                          }}
                          required
                          disabled={loading}
                          error={!!fieldErrors.vehicleType}
                          helperText={fieldErrors.vehicleType}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <LocalShippingOutlined color="primary" />
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Box>
                      <Box>
                        <Typography
                          variant="subtitle1"
                          fontWeight={500}
                          sx={{ mb: 1 }}
                        >
                          Vehicle Plate
                        </Typography>
                        <TextField
                          fullWidth
                          placeholder="Enter vehicle plate number"
                          value={vehiclePlate}
                          onChange={(event) => {
                            setVehiclePlate(event.target.value);
                            clearFieldError("vehiclePlate");
                          }}
                          required
                          disabled={loading}
                          error={!!fieldErrors.vehiclePlate}
                          helperText={fieldErrors.vehiclePlate}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <ConfirmationNumberOutlined color="primary" />
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Box>
                    </>
                  )}
                </>
              )}

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading || !isFormValid()}
                sx={{ mt: 2, py: 1.5, borderRadius: 2.5 }}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : modeType === "login" ? (
                  "Login"
                ) : (
                  "Register"
                )}
              </Button>

              <Typography
                textAlign="center"
                variant="body1"
                color="text.secondary"
                sx={{ mt: 1 }}
              >
                {modeType === "login"
                  ? "Don't have an account?"
                  : "Already have an account?"}{" "}
                <Button
                  type="button"
                  variant="text"
                  onClick={() => {
                    setModeType(modeType === "login" ? "register" : "login");
                    clearFormErrors();
                  }}
                  disabled={loading}
                  sx={{
                    minWidth: 0,
                    p: 0,
                    fontWeight: 700,
                    verticalAlign: "baseline",
                  }}
                >
                  {modeType === "login" ? "Register" : "Login"}
                </Button>
              </Typography>
            </Stack>
          </Box>
        </Stack>
      </Stack>
    </Box>
  );
};

export default Login;
