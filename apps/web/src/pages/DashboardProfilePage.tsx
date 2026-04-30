import { Globe, MapPin, User } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Footer } from "../components/layout/Footer";
import { Header } from "../components/layout/Header";
import { ProtectedRoute } from "@luxero/ui";
import { Button } from "@luxero/ui";
import { Card, CardContent } from "@luxero/ui";
import { Input } from "@luxero/ui";
import { Skeleton } from "@luxero/ui";
import { Switch } from "@luxero/ui";
import { api } from "@luxero/api-client";
import type { ApiResponse } from "@luxero/types";

interface ProfileData {
  fullName?: string;
  email: string;
  phone?: string;
  dateOfBirth?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  postcode?: string;
  country: string;
  marketingConsent: boolean;
  instagram?: string;
  facebook?: string;
  twitter?: string;
  tiktok?: string;
  youtube?: string;
  websiteUrl?: string;
  showLastName: boolean;
  showLocation: boolean;
  showSocials: boolean;
  totalEntries: number;
  totalSpent: number;
  winsCount: number;
}

const SOCIAL_FIELDS = [
  { name: "instagram", label: "Instagram", placeholder: "@username", icon: null },
  { name: "facebook", label: "Facebook", placeholder: "@username", icon: null },
  { name: "twitter", label: "Twitter / X", placeholder: "@username", icon: null },
  { name: "tiktok", label: "TikTok", placeholder: "@username", icon: null },
  { name: "youtube", label: "YouTube", placeholder: "channel URL", icon: null },
  { name: "websiteUrl", label: "Website", placeholder: "https://yoursite.com", icon: Globe },
] as const;

function PublicPreview({ profile }: { profile: ProfileData }) {
  return (
    <Card className="border-gold/20 overflow-hidden">
      <div className="p-1.5 bg-gradient-to-r from-gold/10 to-gold/5">
        <p className="text-xs font-semibold text-gold px-3 py-1.5">Public Entry Preview</p>
      </div>
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gold/30 to-gold/10 flex items-center justify-center flex-shrink-0">
            {profile.fullName ? (
              <span className="text-xl font-bold text-gold">{profile.fullName[0].toUpperCase()}</span>
            ) : (
              <User className="w-7 h-7 text-gold/50" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-foreground">
              {profile.fullName || "Anonymous"}
              {profile.showLastName && profile.fullName ? "" : ""}
            </p>
            {profile.showLocation && profile.city && (
              <p className="text-sm text-muted-foreground flex items-center gap-1 mt-0.5">
                <MapPin className="w-3.5 h-3.5" />
                {profile.city}{profile.postcode ? `, ${profile.postcode}` : ""}
              </p>
            )}
            {profile.showSocials && (
              <div className="flex items-center gap-2 mt-2">
                {profile.instagram && <span className="text-xs text-gold">@{profile.instagram}</span>}
                {profile.twitter && <span className="text-xs text-gold">@{profile.twitter}</span>}
              </div>
            )}
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-2xl font-bold text-gold">{profile.winsCount}</p>
            <p className="text-xs text-muted-foreground">win{profile.winsCount !== 1 ? "s" : ""}</p>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-border/50 flex items-center gap-4">
          <div className="text-center">
            <p className="text-lg font-bold text-foreground">{profile.totalEntries}</p>
            <p className="text-xs text-muted-foreground">entries</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-foreground">£{(profile.totalSpent ?? 0).toFixed(0)}</p>
            <p className="text-xs text-muted-foreground">spent</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ProfileContent() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [form, setForm] = useState<Partial<ProfileData>>({});

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await api.get<ApiResponse<ProfileData>>("/api/me/profile");
        setProfile(res.data);
        setForm(res.data);
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchProfile();
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  }

  function handleSwitch(name: keyof ProfileData, checked: boolean) {
    setForm((prev) => ({ ...prev, [name]: checked }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMsg("");
    setErrorMsg("");

    try {
      const res = await api.put<ApiResponse<ProfileData>>("/api/me/profile", form);
      setProfile(res.data);
      setForm(res.data);
      setSuccessMsg("Profile updated successfully!");
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
            <p className="text-muted-foreground mt-1">Manage your account details</p>
          </div>
          <Link to="/dashboard" className="text-sm text-gold hover:underline">
            ← Back to Dashboard
          </Link>
        </div>

        {isLoading ? (
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="border-gold/20">
                  <CardContent className="p-4 text-center">
                    <Skeleton className="h-8 w-16 mx-auto mb-2" shimmer />
                    <Skeleton className="h-3 w-12 mx-auto" shimmer />
                  </CardContent>
                </Card>
              ))}
            </div>
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="border-gold/20">
                <CardContent className="p-6 space-y-4">
                  <Skeleton className="h-5 w-40" shimmer />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[1, 2].map((j) => (
                      <div key={j} className="space-y-2">
                        <Skeleton className="h-3 w-16" shimmer />
                        <Skeleton className="h-10 w-full" shimmer />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : profile ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            {successMsg && (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium">
                {successMsg}
              </div>
            )}
            {errorMsg && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium">
                {errorMsg}
              </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              <Card className="border-gold/20">
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold text-gold">{profile.totalEntries}</p>
                  <p className="text-xs text-muted-foreground mt-1">Total Entries</p>
                </CardContent>
              </Card>
              <Card className="border-gold/20">
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold text-gold">£{(profile.totalSpent ?? 0).toFixed(2)}</p>
                  <p className="text-xs text-muted-foreground mt-1">Total Spent</p>
                </CardContent>
              </Card>
              <Card className="border-gold/20">
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold text-gold">{profile.winsCount}</p>
                  <p className="text-xs text-muted-foreground mt-1">Wins</p>
                </CardContent>
              </Card>
            </div>

            {/* Public Preview */}
            <PublicPreview profile={profile} />

            {/* Personal Info */}
            <div className="relative overflow-hidden rounded-[1.5rem]">
              <div className="p-1.5 rounded-[1.5rem] bg-white/5 ring-1 ring-white/10">
                <div className="rounded-[calc(1.5rem-0.375rem)] bg-card p-6 space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md bg-gold/10 flex items-center justify-center">
                      <User className="w-3.5 h-3.5 text-gold" />
                    </div>
                    <h2 className="font-semibold text-foreground">Personal Information</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                      <Input
                        name="fullName"
                        value={form.fullName || ""}
                        onChange={handleChange}
                        placeholder="Your full name"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">Phone</label>
                      <Input
                        name="phone"
                        value={form.phone || ""}
                        onChange={handleChange}
                        placeholder="+44 7123 456789"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm font-medium text-muted-foreground">Email</label>
                      <Input
                        name="email"
                        value={form.email || ""}
                        disabled
                        className="opacity-50 cursor-not-allowed"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="relative overflow-hidden rounded-[1.5rem]">
              <div className="p-1.5 rounded-[1.5rem] bg-white/5 ring-1 ring-white/10">
                <div className="rounded-[calc(1.5rem-0.375rem)] bg-card p-6 space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md bg-gold/10 flex items-center justify-center">
                      <MapPin className="w-3.5 h-3.5 text-gold" />
                    </div>
                    <h2 className="font-semibold text-foreground">Delivery Address</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm font-medium text-muted-foreground">Address Line 1</label>
                      <Input
                        name="addressLine1"
                        value={form.addressLine1 || ""}
                        onChange={handleChange}
                        placeholder="123 Main Street"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm font-medium text-muted-foreground">Address Line 2</label>
                      <Input
                        name="addressLine2"
                        value={form.addressLine2 || ""}
                        onChange={handleChange}
                        placeholder="Apt, suite, unit"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">City</label>
                      <Input
                        name="city"
                        value={form.city || ""}
                        onChange={handleChange}
                        placeholder="London"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">Postcode</label>
                      <Input
                        name="postcode"
                        value={form.postcode || ""}
                        onChange={handleChange}
                        placeholder="EC1A 1BB"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="relative overflow-hidden rounded-[1.5rem]">
              <div className="p-1.5 rounded-[1.5rem] bg-white/5 ring-1 ring-white/10">
                <div className="rounded-[calc(1.5rem-0.375rem)] bg-card p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-md bg-gold/10 flex items-center justify-center">
                        <Globe className="w-3.5 h-3.5 text-gold" />
                      </div>
                      <h2 className="font-semibold text-foreground">Social Links</h2>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">Show on public profile</span>
                      <Switch
                        checked={form.showSocials || false}
                        onCheckedChange={(checked) => handleSwitch("showSocials", checked)}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {SOCIAL_FIELDS.map(({ name, label, placeholder, icon: Icon }) => (
                      <div key={name} className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">{label}</label>
                        <div className="relative">
                          {Icon && (
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/50">
                              <Icon className="w-4 h-4" />
                            </div>
                          )}
                          <Input
                            name={name}
                            value={(form as Record<string, string>)[name] || ""}
                            onChange={handleChange}
                            placeholder={placeholder}
                            className={Icon ? "pl-10" : ""}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Privacy Settings */}
            <div className="relative overflow-hidden rounded-[1.5rem]">
              <div className="p-1.5 rounded-[1.5rem] bg-white/5 ring-1 ring-white/10">
                <div className="rounded-[calc(1.5rem-0.375rem)] bg-card p-6 space-y-4">
                  <h2 className="font-semibold text-foreground">Privacy Settings</h2>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between py-2 border-b border-border/30">
                      <div>
                        <p className="text-sm font-medium">Show last name</p>
                        <p className="text-xs text-muted-foreground">Display your full name on public entries</p>
                      </div>
                      <Switch
                        checked={form.showLastName || false}
                        onCheckedChange={(checked) => handleSwitch("showLastName", checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-border/30">
                      <div>
                        <p className="text-sm font-medium">Show location</p>
                        <p className="text-xs text-muted-foreground">Display your city on public entries</p>
                      </div>
                      <Switch
                        checked={form.showLocation || false}
                        onCheckedChange={(checked) => handleSwitch("showLocation", checked)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Marketing */}
            <div className="relative overflow-hidden rounded-[1.5rem]">
              <div className="p-1.5 rounded-[1.5rem] bg-white/5 ring-1 ring-white/10">
                <div className="rounded-[calc(1.5rem-0.375rem)] bg-card p-6 space-y-4">
                  <h2 className="font-semibold text-foreground">Marketing Preferences</h2>
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <p className="text-sm font-medium">Marketing emails</p>
                      <p className="text-xs text-muted-foreground">Receive exclusive offers and competition updates</p>
                    </div>
                    <Switch
                      checked={form.marketingConsent || false}
                      onCheckedChange={(checked) => handleSwitch("marketingConsent", checked)}
                    />
                  </div>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-gold hover:bg-gold-dark text-primary-foreground font-semibold rounded-full py-3 text-base"
              disabled={isSaving}
            >
              {isSaving ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                  Saving...
                </span>
              ) : (
                "Save Changes"
              )}
            </Button>
          </form>
        ) : (
          <Card className="border-gold/20">
            <CardContent className="p-8 text-center">
              <User className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">Failed to load profile</p>
            </CardContent>
          </Card>
        )}
      </main>

      <Footer />
    </div>
  );
}

export function DashboardProfilePage() {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  );
}