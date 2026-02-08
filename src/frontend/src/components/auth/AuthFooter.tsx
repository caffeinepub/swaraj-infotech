import { Phone, Mail } from 'lucide-react';

export default function AuthFooter() {
  return (
    <div className="mt-8 text-center space-y-3">
      <p className="text-sm text-muted-foreground">Need help? Contact us:</p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm">
        <a 
          href="tel:+919689915001" 
          className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
        >
          <Phone className="w-4 h-4" />
          <span>+91 9689915001</span>
        </a>
        <a 
          href="mailto:support@swarajinfotech.com" 
          className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
        >
          <Mail className="w-4 h-4" />
          <span>support@swarajinfotech.com</span>
        </a>
      </div>
    </div>
  );
}
