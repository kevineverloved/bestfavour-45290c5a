import { useState } from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Alert, AlertDescription } from "@/components/ui/alert";

const steps = [
  { id: 'eligibility', title: 'Eligibility' },
  { id: 'personal-info', title: 'Personal Info' },
  { id: 'service-selection', title: 'Service Selection' },
  { id: 'availability', title: 'Availability' },
  { id: 'verification', title: 'Verification' },
]

const serviceCategories = {
  'Home Services': [
    'Cleaning (residential, office, deep cleaning)',
    'Plumbing',
    'Electrical repairs',
    'Gardening and landscaping',
    'Painting and wall repairs',
    'Pest control',
    'Appliance repair and installation',
    'Interior design and decor consultation',
    'Moving/Relocation services',
    'Handyman services',
  ],
  'Personal Services': [
    'Beauty treatments (hair, nails, facials)',
    'Personal styling and wardrobe consultation',
    'Massage therapy',
    'Fitness training',
    'Childcare (babysitting, nanny services)',
    'Elderly care',
    'Pet care (grooming, walking, training)',
  ],
  'Educational Services': [
    'Tutoring (math, science, languages, etc.)',
    'Music lessons (piano, guitar, vocal, etc.)',
    'Test preparation (SATs, GMAT, matric exams)',
    'Language learning',
    'Online courses and workshops',
    'Career coaching and mentorship',
  ],
  'Technology Services': [
    'IT support and troubleshooting',
    'Software development',
    'Website design and maintenance',
    'Digital marketing',
    'SEO and content creation',
    'Computer repair and upgrades',
    'Smartphone repair',
    'Network setup and maintenance',
  ],
  'Transportation Services': [
    'Chauffeur and driver services',
    'Moving and delivery services',
    'Carpooling and shared rides',
    'Vehicle towing',
    'Bicycle and motorbike rentals',
  ],
  'Business Services': [
    'Virtual assistant services',
    'Accounting and bookkeeping',
    'Legal consultation',
    'Business plan writing',
    'Graphic design',
    'Marketing strategy development',
    'Translation and transcription',
  ],
  'Health and Wellness': [
    'Personal trainers',
    'Nutritionists and dietitians',
    'Mental health counseling',
    'Yoga and meditation instructors',
    'Physiotherapy',
    'Midwife and doula services',
  ],
  'Miscellaneous Services': [
    'Event planning and coordination',
    'Photography and videography',
    'Custom tailoring and alterations',
    'Courier and delivery services',
    'Custom crafts and handmade goods',
  ],
  'Cultural and Lifestyle Services': [
    'Party entertainment (DJs, clowns, magicians)',
    'Language interpretation',
    'Religious officiants',
    'Cultural event organization',
    'Heritage and cultural tours',
  ],
}

export default function ServiceProviderOnboarding({ onComplete }: { onComplete: (data: any) => void }) {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState({
    isSouthAfrican: '',
    fullName: '',
    idNumber: '',
    dateOfBirth: '',
    phoneNumber: '',
    email: '',
    streetAddress: '',
    city: '',
    postalCode: '',
    province: '',
    serviceCategory: '',
    specificService: '',
    skills: [] as string[],
    availability: [] as string[],
    idDocument: null as File | null,
    proofOfAddress: null as File | null,
    consentToBackgroundCheck: false,
  })
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prevData => ({ ...prevData, [name]: value }))
  }

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData(prevData => ({ ...prevData, [name]: checked }))
  }

  const handleMultiSelectChange = (name: string, value: string) => {
    setFormData(prevData => {
      const updatedValues = prevData[name as keyof typeof prevData] as string[]
      const newValues = updatedValues.includes(value)
        ? updatedValues.filter(item => item !== value)
        : [...updatedValues, value]
      return { ...prevData, [name]: newValues }
    })
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target
    if (files && files[0]) {
      const file = files[0]
      if (file.size > 10 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, [name]: "File size must be less than 10MB" }))
        return
      }
      if (!['image/jpeg', 'image/png'].includes(file.type)) {
        setErrors(prev => ({ ...prev, [name]: "Only JPG and PNG files are allowed" }))
        return
      }
      const img = new Image()
      img.onload = () => {
        if (img.width * img.height < 640 * 480) {
          setErrors(prev => ({ ...prev, [name]: "Image resolution must be at least 480p" }))
        } else {
          setFormData(prevData => ({ ...prevData, [name]: file }))
          setErrors(prev => ({ ...prev, [name]: "" }))
        }
      }
      img.src = URL.createObjectURL(file)
    }
  }

  const handleNext = () => {
    if (isStepComplete()) {
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1)
      }
    } else {
      validateStep()
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isStepComplete()) {
      console.log('Form submitted:', formData)
      alert('Thanks for applying! We\'ll review your info and get back to you soon.')
    } else {
      validateStep()
    }
  }

  const validateStep = () => {
    const newErrors: { [key: string]: string } = {}
    switch (currentStep) {
      case 0:
        if (formData.isSouthAfrican !== 'yes') {
          newErrors.isSouthAfrican = "You must be a South African citizen or permanent resident"
        }
        break
      case 1:
        if (!formData.fullName) newErrors.fullName = "Full name is required"
        if (!formData.idNumber) {
          newErrors.idNumber = "ID number is required"
        } else if (formData.idNumber.length < 13) {
          newErrors.idNumber = "Please enter a valid ID number (13 digits)"
        }
        if (!formData.dateOfBirth) {
          newErrors.dateOfBirth = "Date of birth is required"
        } else {
          const birthDate = new Date(formData.dateOfBirth)
          const today = new Date()
          let age = today.getFullYear() - birthDate.getFullYear()
          const m = today.getMonth() - birthDate.getMonth()
          if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--
          }
          if (age < 16) {
            newErrors.dateOfBirth = "You must be at least 16 years old to register"
          }
        }
        if (!formData.phoneNumber) newErrors.phoneNumber = "Phone number is required"
        if (!formData.email) newErrors.email = "Email is required"
        if (!formData.streetAddress) newErrors.streetAddress = "Street address is required"
        if (!formData.city) newErrors.city = "City is required"
        if (!formData.postalCode) newErrors.postalCode = "Postal code is required"
        if (!formData.province) newErrors.province = "Province is required"
        break
      case 2:
        if (!formData.serviceCategory) newErrors.serviceCategory = "Service category is required"
        if (!formData.specificService) newErrors.specificService = "Specific service is required"
        break
      case 3:
        if (formData.availability.length === 0) 
          newErrors.availability = "Availability is required"
        break;
      // Add more validation for other steps as needed
    }
    setErrors(newErrors)
  }

  const isStepComplete = () => {
    return Object.keys(errors).length === 0;
  }

  return (
    <Card>
      <CardContent className="space-y-4 pt-6">
        {currentStep === 0 && (
          <div className="space-y-4">
            <Label>Are you a South African citizen or permanent resident?</Label>
            <RadioGroup
              value={formData.isSouthAfrican}
              onValueChange={(value) => setFormData(prev => ({ ...prev, isSouthAfrican: value }))}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="yes" />
                <Label htmlFor="yes">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="no" />
                <Label htmlFor="no">No</Label>
              </div>
            </RadioGroup>
            {errors.isSouthAfrican && (
              <Alert variant="destructive">
                <AlertDescription>{errors.isSouthAfrican}</AlertDescription>
              </Alert>
            )}
          </div>
        )}

        {/* Additional steps would go here, similar to the eligibility step */}

        <div className="flex justify-between mt-6">
          {currentStep > 0 && (
            <Button onClick={handlePrevious} variant="outline">
              <ChevronLeft className="mr-2 h-4 w-4" /> Previous
            </Button>
          )}
          {currentStep < steps.length - 1 ? (
            <Button onClick={handleNext} className="ml-auto">
              Next <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} className="ml-auto">
              Submit Application
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
