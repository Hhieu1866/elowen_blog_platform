import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import UsersTable from "./UsersTable";

const page = () => {
  return (
    <div>
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">User management</h1>
        <p className="text-sm font-medium text-gray-400">
          Manage your users and their account permissions here
        </p>
      </div>
      <div className="mt-10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-semibold">All users</h1>

          <Badge className="h-5 min-w-5 rounded-full px-1 font-mono tabular-nums">
            88
          </Badge>
        </div>

        <div className="flex items-center gap-3">
          <Input placeholder="Search" />
        </div>
      </div>

      <UsersTable />
    </div>
  );
};

export default page;
