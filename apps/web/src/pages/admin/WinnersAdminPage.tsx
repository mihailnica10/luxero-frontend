import { Card, CardContent } from "@luxero/ui";
import { AdminLayout } from "../../components/layout/AdminLayout";

export function WinnersAdminPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Winners</h1>
          <p className="text-muted-foreground mt-1">Manage competition winners</p>
        </div>

        <Card className="border-gold/20">
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">Winners list will appear here</p>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
