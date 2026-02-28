import { useState } from "react";
import { useLocation } from "wouter";
import { useStore, type Claim } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { UploadCloud, CheckCircle2, Loader2, ArrowRight, ShieldAlert } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const BRANDS = ["Toyota", "Hyundai", "Tata", "Honda", "Maruti Suzuki", "BMW", "Audi", "Mercedes", "Mahindra", "Kia", "Other"];
const ENGINES = ["Petrol", "Diesel", "CNG", "Electric", "Hybrid"];

export default function ClaimFlow() {
  const [step, setStep] = useState(1);
  const [, setLocation] = useLocation();
  const addClaim = useStore(state => state.addClaim);

  // Form State
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [variant, setVariant] = useState("");
  const [year, setYear] = useState("");
  const [engine, setEngine] = useState("");
  const [policyType, setPolicyType] = useState<"Comprehensive" | "Third Party">("Comprehensive");
  const [policyNumber, setPolicyNumber] = useState("");
  
  // Image State
  const [images, setImages] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages = Array.from(files).map(file => URL.createObjectURL(file));
      setImages(prev => [...prev, ...newImages].slice(0, 6));
    }
  };

  const handleLoadDemo = () => {
    setBrand("Toyota");
    setModel("Corolla Altis");
    setVariant("VX CVT");
    setYear("2022");
    setEngine("Petrol");
    setPolicyType("Comprehensive");
    setPolicyNumber("POL-12345-67");
    
    // Damaged car images
    setImages([
      "https://images.unsplash.com/photo-1597328290883-50c5787b7c7e?w=800&q=80", // Smashed front
      "https://images.unsplash.com/photo-1621932953986-15fcf084da0f?w=800&q=80", // Dent side
      "https://images.unsplash.com/photo-1599256621730-535171e28e50?w=800&q=80"  // Cracked bumper
    ]);
  };

  const handleNextStep = () => {
    if (!brand || !model || !year || !policyNumber) {
      toast({ title: "Incomplete Form", description: "Please fill all required fields.", variant: "destructive" });
      return;
    }
    setStep(2);
  };

  const processClaim = () => {
    if (images.length === 0) {
      toast({ title: "No Images", description: "Please upload at least one image.", variant: "destructive" });
      return;
    }

    setIsAnalyzing(true);
    
    // Simulate AI delay
    setTimeout(() => {
      setIsAnalyzing(false);
      
      const newClaimId = "CLM-" + Math.random().toString(36).substr(2, 6).toUpperCase();
      
      // Calculate costs based on policy
      const parts = 12500;
      const paint = 4500;
      const labor = parts * 0.3; // 30% of parts
      const total = parts + paint + labor;
      
      let deductible = 0;
      let insurancePayable = 0;
      let customerPayable = 0;
      
      if (policyType === "Comprehensive") {
        deductible = Math.max(1000, total * 0.05);
        insurancePayable = total - deductible;
        customerPayable = deductible;
      } else {
        insurancePayable = 0;
        customerPayable = total;
      }

      // AI Logic
      const aiConfidence = 92;
      const isPreApproved = aiConfidence > 90 && total < 50000;
      const status = isPreApproved ? "Pre-Approved" : "Under Manual Review";

      const claim: Claim = {
        id: newClaimId,
        date: new Date().toISOString(),
        status,
        vehicle: { brand, model, variant, year, engine, policyType, policyNumber },
        damages: [
          { part: "Front Bumper", type: "Dent", severity: "Severe", confidence: 92 },
          { part: "Left Door", type: "Scratch", severity: "Medium", confidence: 85 }
        ],
        estimate: { parts, paint, labor, total, deductible, insurancePayable, customerPayable },
        repairDuration: "2-4 days",
        aiRiskScore: "Low",
        aiConfidence,
        images
      };

      addClaim(claim);
      toast({ title: "Claim Processed", description: "AI analysis complete." });
      setLocation(`/customer/claim/${newClaimId}`);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-10">
          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-bold tracking-tight text-slate-900">File a Claim</h1>
            <div className="flex items-center gap-3 text-sm font-medium text-slate-600 bg-white px-4 py-2 rounded-full shadow-sm border">
              <span className={`flex items-center justify-center w-6 h-6 rounded-full text-xs ${step >= 1 ? 'bg-primary text-primary-foreground' : 'bg-slate-100'}`}>1</span>
              <span>Vehicle Details</span>
              <ArrowRight className="w-4 h-4 mx-1" />
              <span className={`flex items-center justify-center w-6 h-6 rounded-full text-xs ${step >= 2 ? 'bg-primary text-primary-foreground' : 'bg-slate-100'}`}>2</span>
              <span>Upload & Analysis</span>
            </div>
          </div>
        </div>

        {step === 1 && (
          <Card className="shadow-xl border-0 overflow-hidden">
            <div className="h-2 bg-primary"></div>
            <CardHeader className="bg-white border-b px-8 py-8">
              <CardTitle className="text-3xl">Vehicle Information</CardTitle>
              <CardDescription className="text-base">Enter the details of the insured vehicle.</CardDescription>
            </CardHeader>
            <CardContent className="px-8 py-8 space-y-8 bg-white">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <Label className="text-base">Brand *</Label>
                  <Select value={brand} onValueChange={setBrand}>
                    <SelectTrigger className="h-12"><SelectValue placeholder="Select Brand" /></SelectTrigger>
                    <SelectContent>
                      {BRANDS.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-3">
                  <Label className="text-base">Model *</Label>
                  <Input className="h-12" value={model} onChange={e => setModel(e.target.value)} placeholder="e.g. Corolla Altis" />
                </div>
                <div className="space-y-3">
                  <Label className="text-base">Variant</Label>
                  <Input className="h-12" value={variant} onChange={e => setVariant(e.target.value)} placeholder="e.g. VX CVT" />
                </div>
                <div className="space-y-3">
                  <Label className="text-base">Manufacturing Year *</Label>
                  <Input className="h-12" type="number" min="2010" max="2025" value={year} onChange={e => setYear(e.target.value)} placeholder="YYYY" />
                </div>
                <div className="space-y-3">
                  <Label className="text-base">Engine Type</Label>
                  <Select value={engine} onValueChange={setEngine}>
                    <SelectTrigger className="h-12"><SelectValue placeholder="Select Engine" /></SelectTrigger>
                    <SelectContent>
                      {ENGINES.map(e => <SelectItem key={e} value={e}>{e}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="pt-8 border-t border-slate-100 mt-8">
                <h3 className="text-xl font-semibold mb-6 text-slate-800">Policy Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <Label className="text-base">Policy Type *</Label>
                    <Select value={policyType} onValueChange={(v: any) => setPolicyType(v)}>
                      <SelectTrigger className="h-12"><SelectValue placeholder="Select Type" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Comprehensive">Comprehensive</SelectItem>
                        <SelectItem value="Third Party">Third Party</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-3">
                    <Label className="text-base">Policy Number *</Label>
                    <Input className="h-12" value={policyNumber} onChange={e => setPolicyNumber(e.target.value)} placeholder="Enter policy number" />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-slate-50 border-t px-8 py-6 flex justify-between">
              <Button variant="outline" onClick={handleLoadDemo} className="h-12 px-6">Load Demo Set</Button>
              <Button size="lg" onClick={handleNextStep} className="h-12 px-8 text-lg">Next Step <ArrowRight className="ml-2 w-5 h-5"/></Button>
            </CardFooter>
          </Card>
        )}

        {step === 2 && (
          <Card className="shadow-xl border-0 overflow-hidden">
             <div className="h-2 bg-primary"></div>
            <CardHeader className="bg-white border-b px-8 py-8">
              <CardTitle className="text-3xl">Upload Damages</CardTitle>
              <CardDescription className="text-base">Upload up to 6 clear images of the vehicle damage from different angles.</CardDescription>
            </CardHeader>
            <CardContent className="px-8 py-8 space-y-8 bg-white min-h-[400px] flex flex-col justify-center">
              {!isAnalyzing ? (
                <>
                  <div 
                    className="border-2 border-dashed border-slate-300 rounded-2xl p-16 text-center hover:bg-slate-50 transition-all duration-300 cursor-pointer group relative"
                    onClick={() => document.getElementById('file-upload')?.click()}
                  >
                    <input 
                      type="file" 
                      id="file-upload" 
                      className="hidden" 
                      multiple 
                      accept="image/*" 
                      onChange={handleFileUpload}
                    />
                    <UploadCloud className="w-16 h-16 text-slate-300 mx-auto mb-6 group-hover:text-primary transition-colors" />
                    <h3 className="text-xl font-semibold text-slate-700 mb-2">Click or drag images to upload</h3>
                    <p className="text-slate-500 mb-6">JPG, JPEG, PNG (Max 6 images)</p>
                    <Button variant="secondary" onClick={(e) => { e.stopPropagation(); handleLoadDemo(); }}>
                      Click to load Demo Images
                    </Button>
                  </div>

                  {images.length > 0 && (
                    <div className="grid grid-cols-3 gap-6 animate-in slide-in-from-bottom-4 duration-500 mt-8">
                      {images.map((img, idx) => (
                        <div key={idx} className="relative aspect-video rounded-xl overflow-hidden border-2 border-slate-200 shadow-md group">
                          <img src={img} alt={`Damage ${idx + 1}`} className="object-cover w-full h-full" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Button variant="destructive" size="sm" onClick={() => setImages(images.filter((_, i) => i !== idx))}>Remove</Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="py-20 flex flex-col items-center justify-center space-y-8 text-center animate-in fade-in duration-500">
                  <div className="relative">
                    <Loader2 className="w-20 h-20 text-primary animate-spin" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <ShieldAlert className="w-8 h-8 text-primary" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold text-slate-800 mb-3">AI Analysis Engine Running</h3>
                    <p className="text-lg text-slate-500">Scanning images for part detection, severity, and fraud analysis...</p>
                  </div>
                  <div className="w-full max-w-lg bg-slate-100 rounded-full h-3 mt-6 overflow-hidden">
                    <div className="bg-primary h-3 rounded-full w-full animate-[progress_3s_ease-in-out]" style={{ transformOrigin: 'left' }}></div>
                  </div>
                </div>
              )}
            </CardContent>
            {!isAnalyzing && (
              <CardFooter className="bg-slate-50 border-t px-8 py-6 flex justify-between">
                <Button variant="ghost" onClick={() => setStep(1)} className="h-12 px-6">Back</Button>
                <Button size="lg" onClick={processClaim} className="h-12 px-8 text-lg bg-primary hover:bg-primary/90 shadow-md">
                  <CheckCircle2 className="w-5 h-5 mr-2" />
                  Analyze & Submit Claim
                </Button>
              </CardFooter>
            )}
          </Card>
        )}
      </div>
    </div>
  );
}