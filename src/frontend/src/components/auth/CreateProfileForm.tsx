import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, AlertCircle, UserPlus } from 'lucide-react';
import { format } from 'date-fns';
import { useSaveProfile } from '@/hooks/useQueries';

interface CreateProfileFormProps {
    phoneNumber: string;
    onComplete: () => void;
}

export default function CreateProfileForm({ phoneNumber, onComplete }: CreateProfileFormProps) {
    const [name, setName] = useState('');
    const [course, setCourse] = useState('');
    const [examDate, setExamDate] = useState<Date | undefined>(undefined);
    const [error, setError] = useState('');

    const saveProfileMutation = useSaveProfile();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!name.trim()) {
            setError('Please enter your name');
            return;
        }

        if (!course) {
            setError('Please select a course');
            return;
        }

        try {
            await saveProfileMutation.mutateAsync({
                name: name.trim(),
                phone: phoneNumber,
                course,
            });
            onComplete();
        } catch (err: any) {
            setError(err.message || 'Failed to save profile. Please try again.');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="text-center mb-6">
                <h2 className="text-2xl font-bold mb-2">Complete Your Profile</h2>
                <p className="text-muted-foreground">Tell us a bit about yourself</p>
            </div>

            {error && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            <div className="space-y-4">
                <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                        id="name"
                        type="text"
                        placeholder="Enter your full name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="mt-1.5"
                        disabled={saveProfileMutation.isPending}
                        required
                    />
                </div>

                <div>
                    <Label htmlFor="course">Course *</Label>
                    <Select value={course} onValueChange={setCourse} disabled={saveProfileMutation.isPending}>
                        <SelectTrigger id="course" className="mt-1.5">
                            <SelectValue placeholder="Select your course" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="MSCIT">MSCIT</SelectItem>
                            <SelectItem value="GCC-TBC">GCC-TBC</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div>
                    <Label htmlFor="exam-date">Exam Date (Optional)</Label>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                id="exam-date"
                                variant="outline"
                                className="w-full justify-start text-left font-normal mt-1.5"
                                disabled={saveProfileMutation.isPending}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {examDate ? format(examDate, 'PPP') : <span className="text-muted-foreground">Pick a date</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                mode="single"
                                selected={examDate}
                                onSelect={setExamDate}
                                initialFocus
                                disabled={(date) => date < new Date()}
                            />
                        </PopoverContent>
                    </Popover>
                </div>
            </div>

            <Button
                type="submit"
                className="w-full gradient-orange shadow-glow-sm hover:shadow-glow font-semibold py-6 rounded-xl transition-all duration-300 hover:scale-105"
                disabled={saveProfileMutation.isPending}
            >
                {saveProfileMutation.isPending ? (
                    <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                        Creating Profile...
                    </>
                ) : (
                    <>
                        <UserPlus className="mr-2 h-5 w-5" />
                        Create Profile
                    </>
                )}
            </Button>
        </form>
    );
}
