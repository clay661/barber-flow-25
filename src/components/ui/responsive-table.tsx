
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ResponsiveTableProps {
  children: React.ReactNode;
  className?: string;
}

export function ResponsiveTable({ children, className }: ResponsiveTableProps) {
  return (
    <div className="w-full">
      {/* Desktop view */}
      <div className="hidden md:block">
        <div className="border rounded-lg overflow-hidden">
          <Table className={className}>
            {children}
          </Table>
        </div>
      </div>
      
      {/* Mobile view will be handled by individual table implementations */}
      <div className="md:hidden">
        {children}
      </div>
    </div>
  );
}

interface MobileCardProps {
  children: React.ReactNode;
  className?: string;
}

export function MobileCard({ children, className }: MobileCardProps) {
  return (
    <Card className={`mb-4 ${className}`}>
      <CardContent className="p-4">
        {children}
      </CardContent>
    </Card>
  );
}
