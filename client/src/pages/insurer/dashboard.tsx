import { useState } from "react";
import { useStore, type Claim } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ShieldCheck, Search, Filter, AlertTriangle, CheckCircle, FileText, ChevronRight, TrendingUp, AlertOctagon } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Link } from "wouter";

export default function InsurerDashboard() {
  const { claims, updateClaimStatus } = useStore();
  const [filter, setFilter] = useState("All");
  const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null);
  const [overrideStatus, setOverrideStatus] = useState<any>("");
  const [remarks, setRemarks] = useState("");

  const filteredClaims = claims.filter(c => {
    if (filter === "All") return true;
    if (filter === "Pre-approved" && c.status === "Pre-Approved") return true;
    if (filter === "High Value" && c.estimate.total > 50000) return true;
    if (filter === "Low Confidence" && c.aiConfidence < 85) return true;
    if (filter === "Fraud Flagged" && c.aiRiskScore === "High") return true;
    return false;
  });

  const handleOverride = () => {
    if (selectedClaim && overrideStatus) {
      updateClaimStatus(selectedClaim.id, overrideStatus, remarks);
      toast({ title: "Decision Saved", description: `Claim ${selectedClaim.id} updated to ${overrideStatus}` });
      setSelectedClaim(null);
      setOverrideStatus("");
      setRemarks("");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Navbar */}
      <header className="bg-slate-900 text-white p-4 shadow-xl z-10 sticky top-0 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-primary/20 p-2 rounded-lg border border-primary/30">
              <ShieldCheck className="w-6 h-6 text-primary" />
            </div>
            <span className="text-2xl font-bold font-heading tracking-tight">ClaimAgent</span>
            <span className="bg-slate-800 text-slate-300 text-xs px-2 py-1 rounded font-semibold tracking-wider ml-2">INSURER PORTAL</span>
          </div>
          <div className="flex items-center gap-6 text-sm font-medium">
            <span className="text-slate-300 hidden md:inline-block">insurer@claimagent.com</span>
            <Link href="/">
              <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white hover:bg-slate-800">Log out</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto p-6 grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Sidebar Filters */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="border border-slate-200 shadow-sm overflow-hidden">
            <div className="h-1 bg-primary"></div>
            <CardHeader className="pb-4 bg-slate-50/50">
              <CardTitle className="text-lg flex items-center gap-2 text-slate-800"><Filter className="w-5 h-5 text-slate-500"/> Views & Filters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 p-3">
              {[
                { name: "All", icon: <FileText className="w-4 h-4"/> },
                { name: "Pre-approved", icon: <CheckCircle className="w-4 h-4"/> },
                { name: "High Value", icon: <TrendingUp className="w-4 h-4"/> },
                { name: "Low Confidence", icon: <AlertOctagon className="w-4 h-4"/> },
                { name: "Fraud Flagged", icon: <AlertTriangle className="w-4 h-4"/> }
              ].map(f => (
                <button
                  key={f.name}
                  onClick={() => setFilter(f.name)}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all text-sm font-semibold flex items-center gap-3 ${filter === f.name ? 'bg-primary text-white shadow-md' : 'hover:bg-slate-100 text-slate-600'}`}
                >
                  <span className={filter === f.name ? 'text-white' : 'text-slate-400'}>{f.icon}</span>
                  {f.name}
                </button>
              ))}
            </CardContent>
          </Card>

          <Card className="border border-blue-100 shadow-sm bg-blue-50/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between text-blue-900 mb-4 pb-4 border-b border-blue-100">
                <span className="font-semibold text-sm uppercase tracking-wider">Total Claims</span>
                <span className="text-3xl font-black">{claims.length}</span>
              </div>
              <div className="flex items-center justify-between text-amber-700">
                <span className="font-semibold text-sm uppercase tracking-wider">Pending Review</span>
                <span className="text-3xl font-black">{claims.filter(c => c.status === "Under Manual Review").length}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Claims List */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-4">
            <h2 className="text-3xl font-bold text-slate-800 tracking-tight">{filter} Claims</h2>
            <div className="relative w-full sm:w-auto">
              <Search className="w-5 h-5 absolute left-3 top-3.5 text-slate-400" />
              <input type="text" placeholder="Search ID or Policy..." className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg text-sm sm:w-72 focus:outline-none focus:ring-2 focus:ring-primary/50 shadow-sm" />
            </div>
          </div>

          {filteredClaims.length === 0 ? (
            <div className="bg-white p-16 text-center rounded-2xl border border-dashed border-slate-300 shadow-sm">
              <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-700 mb-2">No claims found</h3>
              <p className="text-slate-500">There are no claims matching the current filter criteria.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredClaims.map(claim => (
                <Card key={claim.id} className="border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-200 cursor-pointer group" onClick={() => { setSelectedClaim(claim); setOverrideStatus(claim.status); setRemarks(claim.remarks || ""); }}>
                  <CardContent className="p-0 flex flex-col md:flex-row items-stretch">
                    {/* Status accent bar */}
                    <div className={`w-full md:w-2 ${claim.status === 'Pre-Approved' ? 'bg-green-500' : claim.status === 'Under Manual Review' ? 'bg-amber-500' : 'bg-blue-500'}`}></div>
                    
                    <div className="p-6 flex-1 flex flex-col md:flex-row items-center justify-between gap-6">
                      <div className="flex-1 w-full">
                        <div className="flex items-center gap-3 mb-3">
                          <span className="font-bold font-mono text-slate-900 text-lg bg-slate-100 px-2 py-0.5 rounded">{claim.id}</span>
                          <Badge variant={claim.status === "Pre-Approved" || claim.status === "Finalized" ? "default" : "secondary"} className={`text-xs px-2 py-0.5 ${claim.status === "Under Manual Review" ? "bg-amber-100 text-amber-800 border border-amber-200" : ""}`}>
                            {claim.status}
                          </Badge>
                          {claim.aiRiskScore === "High" && <Badge variant="destructive" className="flex items-center gap-1 text-xs px-2"><AlertTriangle className="w-3 h-3"/> Fraud Risk</Badge>}
                        </div>
                        <p className="text-slate-700 font-semibold">{claim.vehicle.year} {claim.vehicle.brand} {claim.vehicle.model}</p>
                        <p className="text-slate-500 text-sm mt-1">Submitted on {new Date(claim.date).toLocaleDateString()}</p>
                      </div>
                      
                      <div className="flex items-center gap-8 w-full md:w-auto justify-between md:justify-end bg-slate-50 md:bg-transparent p-4 md:p-0 rounded-lg">
                        <div className="text-left md:text-right">
                          <p className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-1">Total Est.</p>
                          <p className="font-black text-xl text-slate-900">₹{claim.estimate.total.toLocaleString()}</p>
                        </div>
                        <div className="text-left md:text-right">
                          <p className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-1">AI Conf.</p>
                          <p className={`font-black text-xl ${claim.aiConfidence > 90 ? 'text-green-600' : 'text-amber-600'}`}>{claim.aiConfidence}%</p>
                        </div>
                        <ChevronRight className="text-slate-300 w-6 h-6 group-hover:text-primary transition-colors group-hover:translate-x-1" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Claim Detail Modal */}
      <Dialog open={!!selectedClaim} onOpenChange={(open) => !open && setSelectedClaim(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0 border-0 overflow-hidden">
          {selectedClaim && (
            <div className="bg-white">
              <div className="bg-slate-900 text-white p-6 md:p-8 flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <DialogTitle className="text-3xl font-bold font-mono">{selectedClaim.id}</DialogTitle>
                    <Badge className={`text-sm px-3 py-1 ${selectedClaim.status === 'Pre-Approved' ? 'bg-green-500' : selectedClaim.status === 'Under Manual Review' ? 'bg-amber-500' : 'bg-blue-500'}`}>{selectedClaim.status}</Badge>
                  </div>
                  <DialogDescription className="text-slate-400 text-base">Review AI assessment and finalize decision.</DialogDescription>
                </div>
                <div className="text-right hidden sm:block">
                  <p className="text-sm text-slate-400">Total Estimate</p>
                  <p className="text-3xl font-bold text-white">₹{selectedClaim.estimate.total.toLocaleString()}</p>
                </div>
              </div>
              
              <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <h4 className="font-bold text-slate-800 text-lg mb-3 flex items-center gap-2"><Car className="w-5 h-5 text-slate-400"/> Vehicle Details</h4>
                    <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 text-sm">
                      <div className="grid grid-cols-2 gap-y-3">
                        <span className="text-slate-500">Make/Model:</span> <span className="font-semibold text-slate-900 text-right">{selectedClaim.vehicle.brand} {selectedClaim.vehicle.model}</span>
                        <span className="text-slate-500">Year:</span> <span className="font-semibold text-slate-900 text-right">{selectedClaim.vehicle.year}</span>
                        <span className="text-slate-500">Policy:</span> <span className="font-mono font-semibold text-primary text-right">{selectedClaim.vehicle.policyNumber}</span>
                        <span className="text-slate-500">Type:</span> <span className="font-semibold text-slate-900 text-right">{selectedClaim.vehicle.policyType}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-bold text-slate-800 text-lg mb-3 flex items-center gap-2"><ShieldCheck className="w-5 h-5 text-slate-400"/> AI Assessment</h4>
                    <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 text-sm">
                       <div className="grid grid-cols-2 gap-y-3">
                        <span className="text-slate-500">Confidence:</span> <span className={`font-black text-right ${selectedClaim.aiConfidence > 90 ? 'text-green-600' : 'text-amber-600'}`}>{selectedClaim.aiConfidence}%</span>
                        <span className="text-slate-500">Risk Score:</span> <span className={`font-black text-right ${selectedClaim.aiRiskScore === 'Low' ? 'text-green-600' : 'text-red-600'}`}>{selectedClaim.aiRiskScore}</span>
                        <span className="text-slate-500">Parts Detected:</span> <span className="font-semibold text-slate-900 text-right">{selectedClaim.damages.length}</span>
                        <span className="text-slate-500">Est. Repair:</span> <span className="font-semibold text-slate-900 text-right">{selectedClaim.repairDuration}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h4 className="font-bold text-slate-800 text-lg mb-3 flex items-center gap-2"><FileText className="w-5 h-5 text-slate-400"/> Financial Breakdown</h4>
                    <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
                      <div className="space-y-2 text-sm text-slate-600">
                        <div className="flex justify-between"><span>Parts + Paint</span><span className="font-semibold text-slate-900">₹{(selectedClaim.estimate.parts + selectedClaim.estimate.paint).toLocaleString()}</span></div>
                        <div className="flex justify-between"><span>Labor</span><span className="font-semibold text-slate-900">₹{selectedClaim.estimate.labor.toLocaleString()}</span></div>
                        <div className="flex justify-between text-slate-500"><span>Deductible</span><span>-₹{selectedClaim.estimate.deductible.toLocaleString()}</span></div>
                        <div className="flex justify-between font-black text-lg text-slate-900 pt-3 border-t border-slate-200 mt-3">
                          <span>Insurance Payable</span><span className="text-primary">₹{selectedClaim.estimate.insurancePayable.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-primary/5 p-6 rounded-xl border border-primary/20">
                    <h4 className="font-bold text-slate-800 text-lg mb-4 flex items-center gap-2"><CheckCircle className="w-5 h-5 text-primary"/> Decision Override</h4>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-semibold text-slate-700">Update Status</Label>
                        <Select value={overrideStatus} onValueChange={setOverrideStatus}>
                          <SelectTrigger className="h-12 bg-white"><SelectValue/></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Under Manual Review">Under Manual Review</SelectItem>
                            <SelectItem value="Pre-Approved">Pre-Approved</SelectItem>
                            <SelectItem value="Finalized">Finalized</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-semibold text-slate-700">Remarks / Internal Notes</Label>
                        <Textarea 
                          placeholder="Add notes for audit trail..." 
                          className="h-24 resize-none bg-white"
                          value={remarks}
                          onChange={e => setRemarks(e.target.value)}
                        />
                      </div>
                      <Button onClick={handleOverride} size="lg" className="w-full h-12 text-base shadow-md"><CheckCircle className="w-5 h-5 mr-2"/> Save Decision</Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Added missing import
import { Car } from "lucide-react";