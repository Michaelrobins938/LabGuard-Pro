"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import {
  Shield,
  FileText,
  User,
  Calendar,
  MapPin,
  AlertTriangle,
  CheckCircle,
  Clock,
  Printer,
  QrCode
} from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface ChainOfCustodyRecord {
  id: string;
  caseNumber: string;
  sampleId: string;
  sampleType: 'clinical' | 'environmental' | 'bioterrorism_suspect';
  collectionOfficer: string;
  collectionDateTime: string;
  collectionLocation: string;
  suspectedAgent?: string;
  urgencyLevel: 'routine' | 'urgent' | 'stat' | 'bioterrorism';
  transfers: CustodyTransfer[];
  currentCustodian: string;
  status: 'active' | 'complete' | 'compromised';
  tamperSealsIntact: boolean;
  storageConditions: string;
  specialInstructions?: string;
}

interface CustodyTransfer {
  id: string;
  fromPerson: string;
  toPerson: string;
  transferDateTime: string;
  purpose: string;
  condition: string;
  signature: string;
  witnessed: boolean;
  witnessName?: string;
}

export default function ChainOfCustodyTab() {
  const [custodyRecords, setCustodyRecords] = useState<ChainOfCustodyRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewRecord, setShowNewRecord] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<ChainOfCustodyRecord | null>(null);
  const [newRecordData, setNewRecordData] = useState<Partial<ChainOfCustodyRecord>>({});

  useEffect(() => {
    fetchCustodyRecords();
  }, []);

  const fetchCustodyRecords = async () => {
    try {
      const response = await fetch('/api/public-health/chain-of-custody');
      const data = await response.json();
      setCustodyRecords(data.data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load chain of custody records.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createNewRecord = async () => {
    try {
      const response = await fetch('/api/public-health/chain-of-custody', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newRecordData,
          collectionDateTime: new Date().toISOString(),
          status: 'active',
          tamperSealsIntact: true,
          transfers: []
        })
      });

      if (!response.ok) throw new Error('Failed to create record');

      const newRecord = await response.json();
      setCustodyRecords([newRecord.data, ...custodyRecords]);
      setShowNewRecord(false);
      setNewRecordData({});

      toast({
        title: "Chain of Custody Created",
        description: `Case ${newRecord.data.caseNumber} has been initiated.`
      });
    } catch (error) {
      toast({
        title: "Creation Failed",
        description: "Failed to create chain of custody record.",
        variant: "destructive"
      });
    }
  };

  const addTransfer = async (recordId: string, transferData: Partial<CustodyTransfer>) => {
    try {
      const response = await fetch(`/api/public-health/chain-of-custody/${recordId}/transfer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...transferData,
          transferDateTime: new Date().toISOString(),
          signature: `${transferData.toPerson}_${Date.now()}` // Digital signature placeholder
        })
      });

      if (!response.ok) throw new Error('Transfer failed');

      fetchCustodyRecords();

      toast({
        title: "Custody Transfer Recorded",
        description: `Sample transferred to ${transferData.toPerson}.`
      });
    } catch (error) {
      toast({
        title: "Transfer Failed",
        description: "Failed to record custody transfer.",
        variant: "destructive"
      });
    }
  };

  const generateCustodyForm = async (recordId: string) => {
    try {
      const response = await fetch(`/api/public-health/chain-of-custody/${recordId}/form`, {
        method: 'POST'
      });

      if (!response.ok) throw new Error('Form generation failed');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `chain_of_custody_${recordId}.pdf`;
      a.click();

      toast({
        title: "Form Generated",
        description: "Chain of custody form has been generated for printing."
      });
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Failed to generate custody form.",
        variant: "destructive"
      });
    }
  };

  const getUrgencyBadge = (level: string) => {
    const variants = {
      'routine': 'default',
      'urgent': 'secondary',
      'stat': 'destructive',
      'bioterrorism': 'destructive'
    } as const;

    const colors = {
      'routine': 'text-blue-600',
      'urgent': 'text-orange-600',
      'stat': 'text-red-600',
      'bioterrorism': 'text-red-600 font-bold'
    };

    return (
      <Badge variant={variants[level as keyof typeof variants]} className={colors[level as keyof typeof colors]}>
        {level === 'bioterrorism' ? '🚨 BIOTERRORISM' : level.toUpperCase()}
      </Badge>
    );
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'complete': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'compromised': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default: return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <span>Chain of Custody Management</span>
            </CardTitle>
            <Dialog open={showNewRecord} onOpenChange={setShowNewRecord}>
              <DialogTrigger asChild>
                <Button>
                  <FileText className="h-4 w-4 mr-2" />
                  New Chain of Custody
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Initiate Chain of Custody</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Case Number</Label>
                    <Input
                      value={newRecordData.caseNumber || ''}
                      onChange={(e) => setNewRecordData({...newRecordData, caseNumber: e.target.value})}
                      placeholder="CASE-2024-001"
                    />
                  </div>

                  <div>
                    <Label>Sample ID</Label>
                    <Input
                      value={newRecordData.sampleId || ''}
                      onChange={(e) => setNewRecordData({...newRecordData, sampleId: e.target.value})}
                      placeholder="BT-SAMPLE-001"
                    />
                  </div>

                  <div>
                    <Label>Sample Type</Label>
                    <select
                      className="w-full p-2 border rounded"
                      value={newRecordData.sampleType || ''}
                      onChange={(e) => setNewRecordData({...newRecordData, sampleType: e.target.value as any})}
                    >
                      <option value="">Select type</option>
                      <option value="clinical">Clinical Sample</option>
                      <option value="environmental">Environmental Sample</option>
                      <option value="bioterrorism_suspect">Bioterrorism Suspect</option>
                    </select>
                  </div>

                  <div>
                    <Label>Collection Officer</Label>
                    <Input
                      value={newRecordData.collectionOfficer || ''}
                      onChange={(e) => setNewRecordData({...newRecordData, collectionOfficer: e.target.value})}
                      placeholder="Officer Name"
                    />
                  </div>

                  <div>
                    <Label>Collection Location</Label>
                    <Input
                      value={newRecordData.collectionLocation || ''}
                      onChange={(e) => setNewRecordData({...newRecordData, collectionLocation: e.target.value})}
                      placeholder="Collection address/location"
                    />
                  </div>

                  <div>
                    <Label>Urgency Level</Label>
                    <select
                      className="w-full p-2 border rounded"
                      value={newRecordData.urgencyLevel || 'routine'}
                      onChange={(e) => setNewRecordData({...newRecordData, urgencyLevel: e.target.value as any})}
                    >
                      <option value="routine">Routine</option>
                      <option value="urgent">Urgent</option>
                      <option value="stat">STAT</option>
                      <option value="bioterrorism">🚨 BIOTERRORISM</option>
                    </select>
                  </div>

                  {newRecordData.sampleType === 'bioterrorism_suspect' && (
                    <div>
                      <Label>Suspected Agent</Label>
                      <Input
                        value={newRecordData.suspectedAgent || ''}
                        onChange={(e) => setNewRecordData({...newRecordData, suspectedAgent: e.target.value})}
                        placeholder="Suspected biological agent"
                      />
                    </div>
                  )}

                  <div>
                    <Label>Storage Conditions</Label>
                    <Input
                      value={newRecordData.storageConditions || ''}
                      onChange={(e) => setNewRecordData({...newRecordData, storageConditions: e.target.value})}
                      placeholder="e.g., -80°C, ambient, refrigerated"
                    />
                  </div>

                  <Button onClick={createNewRecord} className="w-full">
                    Create Chain of Custody
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
      </Card>

      {/* Active Chain of Custody Records */}
      <div className="grid gap-4">
        {custodyRecords.map((record) => (
          <Card key={record.id} className={record.urgencyLevel === 'bioterrorism' ? 'border-red-500 bg-red-50' : ''}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center space-x-3">
                    <h3 className="font-semibold">Case: {record.caseNumber}</h3>
                    {getUrgencyBadge(record.urgencyLevel)}
                    <div className="flex items-center space-x-1">
                      {getStatusIcon(record.status)}
                      <span className="text-sm">{record.status}</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    Sample ID: {record.sampleId} | Officer: {record.collectionOfficer}
                  </p>
                  <p className="text-sm text-gray-600">
                    Location: {record.collectionLocation}
                  </p>
                  {record.suspectedAgent && (
                    <p className="text-sm text-red-600 font-medium">
                      ⚠️ Suspected Agent: {record.suspectedAgent}
                    </p>
                  )}
                </div>

                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => generateCustodyForm(record.id)}
                  >
                    <Printer className="h-4 w-4" />
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedRecord(record)}
                  >
                    <QrCode className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Current Custodian:</span>
                  <span className="font-medium">{record.currentCustodian}</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span>Tamper Seals:</span>
                  <span className={record.tamperSealsIntact ? 'text-green-600' : 'text-red-600'}>
                    {record.tamperSealsIntact ? '✓ Intact' : '⚠️ Compromised'}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span>Storage:</span>
                  <span>{record.storageConditions}</span>
                </div>

                {record.transfers.length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-2">Recent Transfers:</p>
                    <div className="space-y-1">
                      {record.transfers.slice(-3).map((transfer) => (
                        <div key={transfer.id} className="text-xs bg-gray-50 p-2 rounded">
                          {transfer.fromPerson} → {transfer.toPerson}
                          <span className="text-gray-500 ml-2">
                            {new Date(transfer.transferDateTime).toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {record.urgencyLevel === 'bioterrorism' && (
                  <div className="bg-red-100 border border-red-300 rounded p-3">
                    <div className="flex items-center space-x-2 text-red-800">
                      <AlertTriangle className="h-4 w-4" />
                      <span className="font-medium">BIOTERRORISM PROTOCOL ACTIVE</span>
                    </div>
                    <p className="text-sm text-red-700 mt-1">
                      24/7 Contact: 817-353-2020 | Immediate notification required
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {custodyRecords.length === 0 && !loading && (
        <Card>
          <CardContent className="p-8 text-center">
            <Shield className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium mb-2">No Active Chain of Custody Records</h3>
            <p className="text-gray-600 mb-4">
              Create a new chain of custody record to track sample handling and transfers.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 