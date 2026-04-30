import { AdminLayout } from "../../components/layout/AdminLayout";
import { Card, CardContent } from "@luxero/ui";

export function FeaturesAdminPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Features</h1>
          <p className="text-muted-foreground mt-1">Manage platform features</p>
        </div>

        <Card className="border-gold/20">
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">Features list will appear here</p>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
