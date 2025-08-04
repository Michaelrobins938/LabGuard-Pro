"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  FileText,
  Beaker,
  Trees,
  Shield,
  Calendar,
  MapPin,
  User,
  Phone,
  Mail,
  Building,
  AlertTriangle
} from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface ClinicalSubmission {
  patientInfo: {
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    mrn: string;
    address: string;
    phone: string;
  };
  clinicalInfo: {
    symptoms: string[];
    onsetDate: string;
    travelHistory: string;
    occupation: string;
    animalExposure: boolean;
    suspectedAgent: string;
  };
  specimenInfo: {
    type: string;
    collectionDate: string;
    collectionTime: string;
    submittedBy: string;
    facility: string;
  };
  testingRequested: string[];
  urgency: 'routine' | 'urgent' | 'stat' | 'bioterrorism';
}

interface EnvironmentalSubmission {
  sampleInfo: {
    sampleType: string;
    collectionSite: string;
    coordinates: { lat: number; lng: number };
    collectionDate: string;
    collectionTime: string;
    weatherConditions: string;
  };
  suspectedContamination: {
    suspected: boolean;
    agent: string;
    source: string;
    exposureRisk: string;
  };
  submitterInfo: {
    name: string;
    organization: string;
    phone: string;
    email: string;
  };
  testingRequested: string[];
  urgency: 'routine' | 'urgent' | 'stat' | 'bioterrorism';
}

const CLINICAL_TESTS = [
  'West Nile Virus RT-PCR',
  'Zika Virus RT-PCR',
  'Chikungunya RT-PCR',
  'Dengue RT-PCR',
  'Anthrax Culture/PCR',
  'Brucella Culture/PCR',
  'Plague Culture/PCR',
  'Tularemia Culture/PCR',
  'Botulism Toxin Detection',
  'Smallpox PCR',
  'Viral Hemorrhagic Fever Panel'
];

const ENVIRONMENTAL_TESTS = [
  'Environmental Anthrax',
  'Environmental Brucella',
  'Water Quality Analysis',
  'Air Sample Analysis',
  'Soil Contamination',
  'Surface Contamination',
  'Vector Testing (Mosquitoes)',
  'Vector Testing (Ticks)',
  'Vector Testing (Fleas)'
];

const SYMPTOMS = [
  'Fever',
  'Headache',
  'Muscle aches',
  'Nausea/Vomiting',
  'Diarrhea',
  'Respiratory symptoms',
  'Neurological symptoms',
  'Skin lesions',
  'Bleeding',
  'Other'
];

export default function SampleSubmissionForms() {
  const [formType, setFormType] = useState<'clinical' | 'environmental' | null>(null);
  const [clinicalData, setClinicalData] = useState<Partial<ClinicalSubmission>>({});
  const [environmentalData, setEnvironmentalData] = useState<Partial<EnvironmentalSubmission>>({});
  const [submitting, setSubmitting] = useState(false);

  const submitClinicalForm = async () => {
    setSubmitting(true);
    try {
      const response = await fetch('/api/public-health/submissions/clinical', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(clinicalData)
      });

      if (!response.ok) throw new Error('Submission failed');

      const result = await response.json();
      
      toast({
        title: "Clinical Sample Submitted",
        description: `Sample ${result.data.sampleId} has been submitted for testing.`
      });

      setClinicalData({});
      setFormType(null);
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "Failed to submit clinical sample form.",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  const submitEnvironmentalForm = async () => {
    setSubmitting(true);
    try {
      const response = await fetch('/api/public-health/submissions/environmental', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(environmentalData)
      });

      if (!response.ok) throw new Error('Submission failed');

      const result = await response.json();
      
      toast({
        title: "Environmental Sample Submitted",
        description: `Sample ${result.data.sampleId} has been submitted for testing.`
      });

      setEnvironmentalData({});
      setFormType(null);
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "Failed to submit environmental sample form.",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (!formType) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Sample Submission Forms</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-6">
              Select the type of sample submission form you need to complete.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card
                className="cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => setFormType('clinical')}
              >
                <CardContent className="p-6 text-center">
                  <Beaker className="h-12 w-12 mx-auto mb-4 text-blue-500" />
                  <h3 className="font-semibold mb-2">Clinical Sample Submission</h3>
                  <p className="text-sm text-gray-600">
                    For human clinical specimens including suspected bioterrorism cases
                  </p>
                </CardContent>
              </Card>

              <Card
                className="cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => setFormType('environmental')}
              >
                <CardContent className="p-6 text-center">
                  <Trees className="h-12 w-12 mx-auto mb-4 text-green-500" />
                  <h3 className="font-semibold mb-2">Environmental Sample Submission</h3>
                  <p className="text-sm text-gray-600">
                    For environmental specimens, vector surveillance, and contamination testing
                  </p>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (formType === 'clinical') {
    return (
      <div className="space-y-6">
        {/* Form Header */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center space-x-2">
                <Beaker className="h-5 w-5" />
                <span>Clinical Sample Submission Form</span>
              </CardTitle>
              <Button variant="outline" onClick={() => setFormType(null)}>
                Back to Selection
              </Button>
            </div>
          </CardHeader>
        </Card>

        {/* Patient Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>Patient Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>First Name *</Label>
                <Input
                  value={clinicalData.patientInfo?.firstName || ''}
                  onChange={(e) => setClinicalData({
                    ...clinicalData,
                    patientInfo: { ...clinicalData.patientInfo, firstName: e.target.value } as any
                  })}
                />
              </div>

              <div>
                <Label>Last Name *</Label>
                <Input
                  value={clinicalData.patientInfo?.lastName || ''}
                  onChange={(e) => setClinicalData({
                    ...clinicalData,
                    patientInfo: { ...clinicalData.patientInfo, lastName: e.target.value } as any
                  })}
                />
              </div>

              <div>
                <Label>Date of Birth *</Label>
                <Input
                  type="date"
                  value={clinicalData.patientInfo?.dateOfBirth || ''}
                  onChange={(e) => setClinicalData({
                    ...clinicalData,
                    patientInfo: { ...clinicalData.patientInfo, dateOfBirth: e.target.value } as any
                  })}
                />
              </div>

              <div>
                <Label>Medical Record Number</Label>
                <Input
                  value={clinicalData.patientInfo?.mrn || ''}
                  onChange={(e) => setClinicalData({
                    ...clinicalData,
                    patientInfo: { ...clinicalData.patientInfo, mrn: e.target.value } as any
                  })}
                />
              </div>

              <div className="md:col-span-2">
                <Label>Address</Label>
                <Input
                  value={clinicalData.patientInfo?.address || ''}
                  onChange={(e) => setClinicalData({
                    ...clinicalData,
                    patientInfo: { ...clinicalData.patientInfo, address: e.target.value } as any
                  })}
                />
              </div>

              <div>
                <Label>Phone Number</Label>
                <Input
                  value={clinicalData.patientInfo?.phone || ''}
                  onChange={(e) => setClinicalData({
                    ...clinicalData,
                    patientInfo: { ...clinicalData.patientInfo, phone: e.target.value } as any
                  })}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Clinical Information */}
        <Card>
          <CardHeader>
            <CardTitle>Clinical Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label>Symptoms (select all that apply)</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                  {SYMPTOMS.map((symptom) => (
                    <div key={symptom} className="flex items-center space-x-2">
                      <Checkbox
                        id={symptom}
                        checked={clinicalData.clinicalInfo?.symptoms?.includes(symptom) || false}
                        onCheckedChange={(checked) => {
                          const currentSymptoms = clinicalData.clinicalInfo?.symptoms || [];
                          const updatedSymptoms = checked
                            ? [...currentSymptoms, symptom]
                            : currentSymptoms.filter(s => s !== symptom);

                          setClinicalData({
                            ...clinicalData,
                            clinicalInfo: { ...clinicalData.clinicalInfo, symptoms: updatedSymptoms } as any
                          });
                        }}
                      />
                      <Label htmlFor={symptom} className="text-sm">{symptom}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Symptom Onset Date</Label>
                  <Input
                    type="date"
                    value={clinicalData.clinicalInfo?.onsetDate || ''}
                    onChange={(e) => setClinicalData({
                      ...clinicalData,
                      clinicalInfo: { ...clinicalData.clinicalInfo, onsetDate: e.target.value } as any
                    })}
                  />
                </div>

                <div>
                  <Label>Patient Occupation</Label>
                  <Input
                    value={clinicalData.clinicalInfo?.occupation || ''}
                    onChange={(e) => setClinicalData({
                      ...clinicalData,
                      clinicalInfo: { ...clinicalData.clinicalInfo, occupation: e.target.value } as any
                    })}
                  />
                </div>
              </div>

              <div>
                <Label>Travel History (past 30 days)</Label>
                <Textarea
                  value={clinicalData.clinicalInfo?.travelHistory || ''}
                  onChange={(e) => setClinicalData({
                    ...clinicalData,
                    clinicalInfo: { ...clinicalData.clinicalInfo, travelHistory: e.target.value } as any
                  })}
                  placeholder="Describe any travel outside local area"
                />
              </div>

              <div>
                <Label>Suspected Agent (if known)</Label>
                <Input
                  value={clinicalData.clinicalInfo?.suspectedAgent || ''}
                  onChange={(e) => setClinicalData({
                    ...clinicalData,
                    clinicalInfo: { ...clinicalData.clinicalInfo, suspectedAgent: e.target.value } as any
                  })}
                  placeholder="Enter suspected biological agent"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="animalExposure"
                  checked={clinicalData.clinicalInfo?.animalExposure || false}
                  onCheckedChange={(checked) => setClinicalData({
                    ...clinicalData,
                    clinicalInfo: { ...clinicalData.clinicalInfo, animalExposure: checked as boolean } as any
                  })}
                />
                <Label htmlFor="animalExposure">Recent animal exposure</Label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Testing Requested */}
        <Card>
          <CardHeader>
            <CardTitle>Testing Requested</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label>Select tests to perform</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                  {CLINICAL_TESTS.map((test) => (
                    <div key={test} className="flex items-center space-x-2">
                      <Checkbox
                        id={test}
                        checked={clinicalData.testingRequested?.includes(test) || false}
                        onCheckedChange={(checked) => {
                          const currentTests = clinicalData.testingRequested || [];
                          const updatedTests = checked
                            ? [...currentTests, test]
                            : currentTests.filter(t => t !== test);

                          setClinicalData({
                            ...clinicalData,
                            testingRequested: updatedTests
                          });
                        }}
                      />
                      <Label htmlFor={test} className="text-sm">{test}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label>Urgency Level</Label>
                <RadioGroup
                  value={clinicalData.urgency || 'routine'}
                  onValueChange={(value) => setClinicalData({
                    ...clinicalData,
                    urgency: value as any
                  })}
                  className="mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="routine" id="routine" />
                    <Label htmlFor="routine">Routine (5-7 business days)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="urgent" id="urgent" />
                    <Label htmlFor="urgent">Urgent (24-48 hours)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="stat" id="stat" />
                    <Label htmlFor="stat">STAT (same day)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="bioterrorism" id="bioterrorism" />
                    <Label htmlFor="bioterrorism" className="text-red-600 font-medium">
                      🚨 BIOTERRORISM SUSPECT (immediate)
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {clinicalData.urgency === 'bioterrorism' && (
                <div className="bg-red-100 border border-red-300 rounded p-4">
                  <div className="flex items-center space-x-2 text-red-800">
                    <AlertTriangle className="h-5 w-5" />
                    <span className="font-medium">BIOTERRORISM PROTOCOL ACTIVATED</span>
                  </div>
                  <p className="text-sm text-red-700 mt-2">
                    This submission will trigger immediate notification to CDC and law enforcement.
                    24/7 Emergency Contact: 817-353-2020
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-600">
                * Required fields. Form will be reviewed and processed according to urgency level.
              </p>
              <Button onClick={submitClinicalForm} disabled={submitting}>
                {submitting ? 'Submitting...' : 'Submit Clinical Sample Form'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Environmental form would be similar structure but with different fields
  return (
    <div className="space-y-6">
      {/* Environmental form implementation here */}
      <Card>
        <CardContent className="p-6 text-center">
          <Trees className="h-12 w-12 mx-auto mb-4 text-green-500" />
          <h3 className="text-lg font-medium mb-2">Environmental Sample Submission</h3>
          <p className="text-gray-600">Environmental form implementation similar to clinical form above</p>
          <Button className="mt-4" onClick={() => setFormType(null)}>
            Back to Selection
          </Button>
        </CardContent>
      </Card>
    </div>
  );
} 