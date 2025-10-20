// components/LicenseDetails.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, Calendar, FileText } from 'lucide-react';
import { LicenseDTO } from "@/types/provider";

interface LicenseDetailsProps {
    licenses: LicenseDTO[];
}

const LicenseDetails = ({ licenses }: LicenseDetailsProps) => {
    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'APPROVED':
                return <Badge className="bg-green-600">Approved</Badge>;
            case 'PENDING':
                return <Badge variant="secondary">Pending</Badge>;
            case 'REJECTED':
                return <Badge variant="destructive">Rejected</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    const handleDownload = (licenseUrl: string, licenseNumber: string) => {
        const link = document.createElement('a');
        link.href = licenseUrl;
        link.download = `license-${licenseNumber}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Business Licenses</CardTitle>
                <CardDescription>Manage and review provider licenses</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {licenses.map((license, index) => (
                        <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                                    <FileText className="w-6 h-6 text-primary-500" />
                                </div>
                                <div>
                                    <h4 className="font-medium">{license.category?.categoryName || 'Unknown Category'}</h4>
                                    <p className="text-sm text-gray-600">License: {license.licenseNumber}</p>
                                    <div className="flex items-center space-x-2 mt-1">
                                        <Calendar className="w-4 h-4 text-gray-400" />
                                        <span className="text-sm text-gray-500">
                                            Expires: {new Date(license.expiryDate).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="text-right space-y-2">
                                {getStatusBadge(license.status)}
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleDownload(license.licenseUrl, license.licenseNumber)}
                                >
                                    <Download className="w-4 h-4 mr-1" />
                                    Download
                                </Button>
                            </div>
                        </div>
                    ))}
                    {licenses.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                            <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                            <p className="font-medium">No licenses found</p>
                            <p className="text-sm">This provider has no registered licenses.</p>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export default LicenseDetails;