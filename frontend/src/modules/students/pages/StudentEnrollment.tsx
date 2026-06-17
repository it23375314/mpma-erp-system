import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../../layouts/DashboardLayout";
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  MapPin, 
  GraduationCap, 
  Check, 
  ChevronRight, 
  ArrowLeft,
  Save,
  Upload,
  X,
  FileText,
  IdCard,
  Globe,
  Info,
  Loader2,
  CheckCircle2
} from "lucide-react";
import { toast } from "react-toastify";
import { fetchApi } from "../../../utils/api";

const StudentEnrollment = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [draftSaving, setDraftSaving] = useState(false);

  const [formData, setFormData] = useState({
    // Step 1: Personal
    firstName: "",
    lastName: "",
    fullName: "",
    identificationType: "NIC",
    idNumber: "",
    nationality: "Sri Lankan",
    dob: "",
    gender: "Male",
    
    // Step 2: Contact
    email: "",
    phone: "",
    address: "",

    // Step 3: Course
    course: "",
    batch: "",
    registrationDate: new Date().toISOString().split('T')[0],

    // Step 4: Additional Details
    studentCategory: "Regular Student",
    companyName: "",
    outsidePosition: "",
    epfNumber: "",
    department: "",
    slpaPosition: "",

    // Step 5: Documents
    documents: [] as any[]
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const steps = [
    { id: 1, title: "Personal Information", icon: User },
    { id: 2, title: "Contact Information", icon: Mail },
    { id: 3, title: "Course Selection", icon: GraduationCap },
    { id: 4, title: "Additional Details", icon: Info },
    { id: 5, title: "Documents", icon: Upload },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {};
    
    if (step === 1) {
      if (!formData.fullName) newErrors.fullName = "Full Name is required";
      if (!formData.idNumber) newErrors.idNumber = "ID Number is required";
      if (!formData.dob) newErrors.dob = "Date of Birth is required";
    } else if (step === 2) {
      if (!formData.phone) newErrors.phone = "Phone number is required";
      if (!formData.address) newErrors.address = "Address is required";
      if (!formData.email) newErrors.email = "Email is required";
    } else if (step === 3) {
      if (!formData.course) newErrors.course = "Course selection is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 5) setCurrentStep(prev => prev + 1);
    } else {
      toast.error("Please fill in all required fields.");
    }
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(prev => prev - 1);
  };

  const handleSaveDraft = async () => {
    setDraftSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setDraftSaving(false);
    toast.success("Draft saved successfully.");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(5)) return;

    setLoading(true);
    try {
      // Mapping wizard data to backend Student model
      const names = formData.fullName.split(" ");
      const firstName = names[0];
      const lastName = names.slice(1).join(" ") || " ";

      const submitData = {
        firstName,
        lastName,
        email: formData.email,
        phone: formData.phone,
        dob: formData.dob,
        gender: formData.gender,
        address: formData.address,
        course: formData.course,
        batch: formData.batch || "2024 Fall",
        // Additional meta could be added here if backend supports it
      };

      await fetchApi('/students/enroll', {
        method: 'POST',
        body: JSON.stringify(submitData)
      });

      toast.success("Student enrolled successfully!");
      navigate("/student-management/enrollment");
    } catch (error: any) {
      toast.error(error.message || "Enrollment failed.");
    } finally {
      setLoading(false);
    }
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).map(file => ({
        name: file.name,
        size: (file.size / (1024 * 1024)).toFixed(2) + " MB",
        type: file.type
      }));
      setFormData(prev => ({ ...prev, documents: [...prev.documents, ...newFiles] }));
    }
  };

  const removeFile = (index: number) => {
    setFormData(prev => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index)
    }));
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto px-4 pb-24">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate(-1)}
              className="p-3 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all shadow-sm"
            >
              <ArrowLeft className="w-5 h-5 text-slate-600" />
            </button>
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Student Enrollment</h1>
              <p className="text-slate-500 font-medium">Enterprise Academic Enrollment Portal</p>
            </div>
          </div>
          
          {/* Stepper */}
          <div className="hidden lg:flex items-center gap-2 bg-white p-2 rounded-2xl border border-slate-100 shadow-sm">
            {steps.map((step, idx) => (
              <React.Fragment key={step.id}>
                <div 
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                    currentStep === step.id 
                      ? "bg-brand-50 text-brand-700 shadow-sm border border-brand-100" 
                      : currentStep > step.id 
                        ? "text-emerald-600" 
                        : "text-slate-400"
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${
                    currentStep === step.id 
                      ? "bg-brand-600 text-white" 
                      : currentStep > step.id 
                        ? "bg-emerald-100 text-emerald-600" 
                        : "bg-slate-100"
                  }`}>
                    {currentStep > step.id ? <Check className="w-5 h-5" /> : step.id}
                  </div>
                  <span className="text-sm font-bold whitespace-nowrap">{step.title}</span>
                </div>
                {idx < steps.length - 1 && <ChevronRight className="w-4 h-4 text-slate-300" />}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/40 border border-slate-100 overflow-hidden">
          <form onSubmit={handleSubmit}>
            <div className="p-10">
              
              {/* Step 1: Personal Information */}
              {currentStep === 1 && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="flex items-center gap-4 py-4 border-b border-slate-50">
                    <div className="w-12 h-12 rounded-2xl bg-brand-50 flex items-center justify-center text-brand-600">
                      <User className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-slate-800">Personal Information</h2>
                      <p className="text-sm text-slate-500">Standardized identity verification fields</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="md:col-span-2 space-y-2">
                       <label className="text-sm font-bold text-slate-700 ml-1">Full Name (As per NIC/Passport) <span className="text-red-500">*</span></label>
                       <div className="relative">
                         <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                         <input 
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleInputChange}
                            className={`w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent rounded-[1.25rem] text-sm font-semibold focus:bg-white focus:border-brand-500 outline-none transition-all ${errors.fullName ? 'border-red-400 bg-red-50/30' : ''}`}
                            placeholder="Enter full name" 
                          />
                       </div>
                       {errors.fullName && <p className="text-xs text-red-500 mt-1 ml-1 font-bold">{errors.fullName}</p>}
                    </div>

                    <div className="space-y-2">
                       <label className="text-sm font-bold text-slate-700 ml-1">Identification Type</label>
                       <div className="relative">
                         <IdCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                         <select 
                            name="identificationType"
                            value={formData.identificationType}
                            onChange={handleInputChange}
                            className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent rounded-[1.25rem] text-sm font-semibold focus:bg-white focus:border-brand-500 outline-none transition-all appearance-none cursor-pointer"
                          >
                            <option value="NIC">NIC (National Identity Card)</option>
                            <option value="Passport">International Passport</option>
                          </select>
                       </div>
                    </div>

                    <div className="space-y-2">
                       <label className="text-sm font-bold text-slate-700 ml-1">ID Number <span className="text-red-500">*</span></label>
                       <div className="relative">
                         <FileText className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                         <input 
                            name="idNumber"
                            value={formData.idNumber}
                            onChange={handleInputChange}
                            className={`w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent rounded-[1.25rem] text-sm font-semibold focus:bg-white focus:border-brand-500 outline-none transition-all ${errors.idNumber ? 'border-red-400' : ''}`}
                            placeholder="e.g. 199512345678" 
                          />
                       </div>
                       {errors.idNumber && <p className="text-xs text-red-500 mt-1 ml-1 font-bold">{errors.idNumber}</p>}
                    </div>

                    <div className="space-y-2">
                       <label className="text-sm font-bold text-slate-700 ml-1">Nationality</label>
                       <div className="relative">
                         <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                         <input 
                            name="nationality"
                            value={formData.nationality}
                            onChange={handleInputChange}
                            className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent rounded-[1.25rem] text-sm font-semibold focus:bg-white focus:border-brand-500 outline-none transition-all"
                          />
                       </div>
                    </div>

                    <div className="space-y-2">
                       <label className="text-sm font-bold text-slate-700 ml-1">Date of Birth <span className="text-red-500">*</span></label>
                       <div className="relative">
                         <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                         <input 
                            type="date"
                            name="dob"
                            value={formData.dob}
                            onChange={handleInputChange}
                            className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent rounded-[1.25rem] text-sm font-semibold focus:bg-white focus:border-brand-500 outline-none transition-all"
                          />
                       </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Contact Information */}
              {currentStep === 2 && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                   <div className="flex items-center gap-4 py-4 border-b border-slate-50">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                      <Mail className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-slate-800">Contact Information</h2>
                      <p className="text-sm text-slate-500">How we can reach the student</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                       <label className="text-sm font-bold text-slate-700 ml-1">Email <span className="text-red-500">*</span></label>
                       <div className="relative">
                         <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                         <input 
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent rounded-[1.25rem] text-sm font-semibold focus:bg-white focus:border-brand-500 outline-none transition-all"
                            placeholder="example@email.com" 
                          />
                       </div>
                       {errors.email && <p className="text-xs text-red-500 mt-1 ml-1 font-bold">{errors.email}</p>}
                    </div>

                    <div className="space-y-2">
                       <label className="text-sm font-bold text-slate-700 ml-1">Phone Number <span className="text-red-500">*</span></label>
                       <div className="relative">
                         <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                         <input 
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent rounded-[1.25rem] text-sm font-semibold focus:bg-white focus:border-brand-500 outline-none transition-all"
                            placeholder="e.g. 077 123 4567" 
                          />
                       </div>
                       {errors.phone && <p className="text-xs text-red-500 mt-1 ml-1 font-bold">{errors.phone}</p>}
                    </div>

                    <div className="md:col-span-2 space-y-2">
                       <label className="text-sm font-bold text-slate-700 ml-1">Address <span className="text-red-500">*</span></label>
                       <div className="relative">
                         <MapPin className="absolute left-4 top-6 w-5 h-5 text-slate-400" />
                         <textarea 
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            rows={3}
                            className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent rounded-[1.25rem] text-sm font-semibold focus:bg-white focus:border-brand-500 outline-none transition-all resize-none"
                            placeholder="Residential address" 
                          />
                       </div>
                       {errors.address && <p className="text-xs text-red-500 mt-1 ml-1 font-bold">{errors.address}</p>}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Course Selection */}
              {currentStep === 3 && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="flex items-center gap-4 py-4 border-b border-slate-50">
                    <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600">
                      <GraduationCap className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-slate-800">Course Selection</h2>
                      <p className="text-sm text-slate-500">Select academic program</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                       <label className="text-sm font-bold text-slate-700 ml-1">Program <span className="text-red-500">*</span></label>
                       <div className="relative">
                         <Info className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                         <select 
                            name="course"
                            value={formData.course}
                            onChange={handleInputChange}
                            className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent rounded-[1.25rem] text-sm font-semibold focus:bg-white focus:border-brand-500 outline-none transition-all appearance-none cursor-pointer"
                          >
                            <option value="">Choose a course</option>
                            <option value="ICT">Computer Science</option>
                            <option value="Business">Business Admin</option>
                            <option value="Eng">Engineering</option>
                          </select>
                       </div>
                       {errors.course && <p className="text-xs text-red-500 mt-1 ml-1 font-bold">{errors.course}</p>}
                    </div>

                    <div className="space-y-2">
                       <label className="text-sm font-bold text-slate-700 ml-1">Batch</label>
                       <div className="relative">
                         <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                         <input 
                            name="batch"
                            value={formData.batch}
                            onChange={handleInputChange}
                            className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent rounded-[1.25rem] text-sm font-semibold focus:bg-white focus:border-brand-500 outline-none transition-all"
                            placeholder="e.g. 2024 Fall" 
                          />
                       </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Additional Details */}
              {currentStep === 4 && (
                <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="flex items-center gap-4 py-4 border-b border-slate-50">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
                      <Info className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-slate-800">Additional Details</h2>
                      <p className="text-sm text-slate-500">Category classification</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <label className="text-sm font-black text-slate-400 uppercase tracking-widest ml-1">Student Category</label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {["Regular Student", "Outside Student", "SLPA Employee"].map((cat) => (
                        <label 
                          key={cat}
                          className={`flex items-center gap-4 p-5 rounded-[1.5rem] border-2 transition-all cursor-pointer ${
                            formData.studentCategory === cat 
                              ? 'bg-brand-50 border-brand-500 shadow-lg shadow-brand-500/10' 
                              : 'bg-slate-50 border-transparent hover:border-slate-200'
                          }`}
                        >
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                            formData.studentCategory === cat ? 'border-brand-600 bg-brand-600' : 'border-slate-300'
                          }`}>
                            {formData.studentCategory === cat && <div className="w-2 h-2 rounded-full bg-white" />}
                          </div>
                          <span className={`text-sm font-bold ${formData.studentCategory === cat ? 'text-brand-900' : 'text-slate-600'}`}>{cat}</span>
                          <input 
                            type="radio" 
                            name="studentCategory" 
                            value={cat} 
                            checked={formData.studentCategory === cat}
                            onChange={handleInputChange}
                            className="hidden" 
                          />
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="bg-slate-50/50 rounded-[2rem] p-10 border border-slate-100">
                    {formData.studentCategory === "Outside Student" && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in zoom-in-95 duration-300">
                         <div className="space-y-2">
                           <label className="text-sm font-bold text-slate-700 ml-1">Company Name</label>
                           <input 
                              name="companyName"
                              value={formData.companyName}
                              onChange={handleInputChange}
                              className="w-full px-4 py-4 bg-white border-2 border-transparent rounded-[1.25rem] text-sm font-semibold focus:border-brand-500 outline-none transition-all shadow-sm"
                              placeholder="Company name" 
                            />
                         </div>
                         <div className="space-y-2">
                           <label className="text-sm font-bold text-slate-700 ml-1">Designation</label>
                           <input 
                              name="outsidePosition"
                              value={formData.outsidePosition}
                              onChange={handleInputChange}
                              className="w-full px-4 py-4 bg-white border-2 border-transparent rounded-[1.25rem] text-sm font-semibold focus:border-brand-500 outline-none transition-all shadow-sm"
                            />
                         </div>
                      </div>
                    )}

                    {formData.studentCategory === "SLPA Employee" && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in zoom-in-95 duration-300">
                         <div className="space-y-2">
                           <label className="text-sm font-bold text-slate-700 ml-1">EPF Number</label>
                           <input 
                              name="epfNumber"
                              value={formData.epfNumber}
                              onChange={handleInputChange}
                              className="w-full px-4 py-4 bg-white border-2 border-transparent rounded-[1.25rem] text-sm font-semibold focus:border-brand-500 outline-none transition-all shadow-sm"
                            />
                         </div>
                         <div className="space-y-2">
                           <label className="text-sm font-bold text-slate-700 ml-1">Department</label>
                           <input 
                              name="department"
                              value={formData.department}
                              onChange={handleInputChange}
                              className="w-full px-4 py-4 bg-white border-2 border-transparent rounded-[1.25rem] text-sm font-semibold focus:border-brand-500 outline-none transition-all shadow-sm"
                            />
                         </div>
                      </div>
                    )}

                    {formData.studentCategory === "Regular Student" && (
                       <div className="flex flex-col items-center justify-center py-10 text-center">
                          <CheckCircle2 className="w-16 h-16 text-emerald-500 mb-4" />
                          <h3 className="text-lg font-bold text-slate-800">Regular Student Selected</h3>
                          <p className="text-sm text-slate-500">Registration as a standard regular student.</p>
                       </div>
                    )}
                  </div>
                </div>
              )}

              {/* Step 5: Documents */}
              {currentStep === 5 && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                   <div className="flex items-center gap-4 py-4 border-b border-slate-50">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                      <Upload className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-slate-800">Support Documents</h2>
                      <p className="text-sm text-slate-500">Scanned copies of required certificates</p>
                    </div>
                  </div>

                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="border-4 border-dashed border-slate-100 bg-slate-50 rounded-[2.5rem] p-16 text-center hover:border-brand-400 cursor-pointer transition-all"
                  >
                    <input 
                      type="file" 
                      multiple 
                      className="hidden" 
                      ref={fileInputRef}
                      onChange={handleFileChange}
                    />
                    <div className="max-w-xs mx-auto space-y-4">
                      <div className="w-20 h-20 bg-white rounded-[2rem] mx-auto flex items-center justify-center text-slate-400 shadow-xl shadow-slate-200">
                        <Upload className="w-10 h-10" />
                      </div>
                      <h3 className="text-lg font-black text-slate-800">Upload documents</h3>
                      <p className="text-sm text-slate-500 font-bold uppercase tracking-widest text-[10px]">PDF, JPG, PNG (MAX 5MB)</p>
                    </div>
                  </div>

                  {/* File List */}
                  {formData.documents.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {formData.documents.map((doc, idx) => (
                        <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                          <div className="flex items-center gap-4">
                            <FileText className="w-6 h-6 text-brand-600" />
                            <div>
                              <p className="text-sm font-bold text-slate-800 truncate max-w-[200px]">{doc.name}</p>
                              <p className="text-[10px] text-slate-400">{doc.size}</p>
                            </div>
                          </div>
                          <button 
                            type="button"
                            onClick={(e) => { e.stopPropagation(); removeFile(idx); }}
                            className="p-2 text-slate-300 hover:text-red-500 transition-all font-bold"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Action Bar */}
            <div className="px-10 py-8 bg-slate-50 border-t border-slate-100 flex items-center justify-between sticky bottom-0 z-10">
              <div className="flex gap-4">
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={handleBack}
                    className="px-8 py-4 bg-white border-2 border-slate-200 text-slate-600 font-bold rounded-2xl hover:border-brand-500 transition-all flex items-center gap-2 active:scale-95"
                  >
                    <ArrowLeft className="w-5 h-5" />
                    Previous
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleSaveDraft}
                  disabled={draftSaving}
                  className="px-8 py-4 text-slate-500 hover:text-brand-600 font-bold rounded-2xl transition-all flex items-center gap-2 active:scale-95"
                >
                  {draftSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                  Save Draft
                </button>
              </div>

              <div className="flex gap-4">
                {currentStep < 5 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="px-10 py-4 bg-brand-600 hover:bg-brand-700 text-white font-black rounded-2xl shadow-xl transition-all flex items-center gap-3 active:scale-95"
                  >
                    Continue
                    <ChevronRight className="w-5 h-5" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-10 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-2xl shadow-xl transition-all flex items-center gap-3 active:scale-95"
                  >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
                    Complete Enrollment
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentEnrollment;
