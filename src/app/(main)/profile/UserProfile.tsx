/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/useAuth";
import api from "@/lib/api";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type User = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
};

type ProfileForm = {
  name: string;
  email: string;
};

type PasswordForm = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

const UserProfile = () => {
  const { user: currentUser, isAuthenticated } = useAuth();

  const [user, setUser] = useState<User | null>(null);
  const [profileForm, setProfileForm] = useState<ProfileForm>({
    name: "",
    email: "",
  });
  const [passwordForm, setPasswordForm] = useState<PasswordForm>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const [error, setError] = useState("");

  useEffect(() => {
    const loadUser = async () => {
      setIsLoading(true);
      setError("");

      try {
        const userId = currentUser.value?.id;
        const response = await api.get(`/users/${userId}`);

        setUser(response.data.user);
        setProfileForm({
          name: response.data.user.name,
          email: response.data.user.email,
        });
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load profile");
        toast.error("Failed to load your profile");
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, [currentUser.value, isAuthenticated.value]);

  const handleUpdateProfile = async () => {
    setIsUpdatingProfile(true);
    setError("");

    try {
      const response = await api.put(`/users/${user?.id}`, {
        name: profileForm.name,
      });

      setUser(response.data.user);
      toast.success("Profile updated successfully");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update profile");
      toast.error("Failed to update profile");
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError("New password dont't match");
      toast.error("New password dont't match");
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      toast.error("Password must be at least 6 characters");
      return;
    }

    setIsChangingPassword(true);
    setError("");

    try {
      await api.put(`/users/${user?.id}/password`, {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });

      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      toast.success("Password changed successfully");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to change password");
      toast.error("Failed to change password");
    } finally {
      setIsChangingPassword(false);
    }
  };

  if (isLoading) {
    return (
      <div className="mt-5">
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>Loading profile...</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="h-10 animate-pulse rounded bg-gray-200" />
              <div className="h-10 animate-pulse rounded bg-gray-200" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mt-5 space-y-5">
      <div className="space-y-6">
        <div className="space-y-3">
          <h2 className="font-semibold">Full name</h2>
          <div className="space-y-1">
            <Label htmlFor="name" className="text-xs">
              Name
            </Label>
            <div className="flex items-center gap-3">
              <Input
                id="name"
                value={profileForm.name}
                onChange={(e) =>
                  setProfileForm((prev) => ({ ...prev, name: e.target.value }))
                }
                className="w-1/3 font-semibold shadow"
                placeholder="Enter your name"
                disabled={isUpdatingProfile}
              />
              <Button
                onClick={handleUpdateProfile}
                disabled={isUpdatingProfile || profileForm.name === user?.name}
                className="w-full sm:w-auto"
              >
                {isUpdatingProfile ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-3">
          <div>
            <h2 className="font-semibold">Contact email</h2>
            <p className="text-xs font-medium text-gray-500">
              Manage your accounts email address for the invoices
            </p>
          </div>
          <div className="space-y-1">
            <Label htmlFor="email font-bold" className="text-xs">
              Email
            </Label>
            <Input
              id="email"
              value={profileForm.email}
              disabled
              className="w-1/3 font-semibold shadow"
            />
          </div>
          <p className="text-sm italic text-gray-500">
            Email cannot be changed
          </p>
        </div>

        <Separator />

        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>

      <div className="space-y-3">
        <div>
          <h2 className="font-semibold">Password</h2>
          <p className="text-xs font-medium text-gray-500">
            Modify your current password
          </p>
        </div>
        <div className="space-y-1">
          <Label htmlFor="currentPassword" className="text-xs">
            Current password
          </Label>
          <Input
            id="currentPassword"
            type="password"
            value={passwordForm.currentPassword}
            onChange={(e) =>
              setPasswordForm((prev) => ({
                ...prev,
                currentPassword: e.target.value,
              }))
            }
            placeholder="Enter current password"
            className="w-1/3 font-semibold shadow"
            disabled={isChangingPassword}
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="newPassword" className="text-xs">
            New Password
          </Label>
          <Input
            id="newPassword"
            type="password"
            value={passwordForm.newPassword}
            onChange={(e) =>
              setPasswordForm((prev) => ({
                ...prev,
                newPassword: e.target.value,
              }))
            }
            placeholder="Enter new password"
            className="w-1/3 font-semibold shadow"
            disabled={isChangingPassword}
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="confirmPassword" className="text-xs">
            Confirm New Password
          </Label>
          <Input
            id="confirmPassword"
            type="password"
            value={passwordForm.confirmPassword}
            onChange={(e) =>
              setPasswordForm((prev) => ({
                ...prev,
                confirmPassword: e.target.value,
              }))
            }
            placeholder="Confirm new password"
            className="w-1/3 font-semibold shadow"
            disabled={isChangingPassword}
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <Button
          onClick={handleChangePassword}
          disabled={
            isChangingPassword ||
            !passwordForm.currentPassword ||
            !passwordForm.newPassword ||
            !passwordForm.confirmPassword
          }
          className="w-full sm:w-auto"
        >
          {isChangingPassword ? "Changing Password..." : "Change Password"}
        </Button>
      </div>
    </div>
  );
};

export default UserProfile;
