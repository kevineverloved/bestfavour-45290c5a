import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

const ConnectionMessage = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Connection Required</CardTitle>
        <CardDescription>
          Please connect your project to Supabase to enable authentication.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Alert>
          <AlertDescription>
            To connect to Supabase:
            <ol className="list-decimal ml-4 mt-2">
              <li>Click on the Supabase menu in the top right corner</li>
              <li>Click "Connect to Supabase"</li>
              <li>Follow the prompts to complete the connection</li>
            </ol>
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  </div>
);

export default ConnectionMessage;