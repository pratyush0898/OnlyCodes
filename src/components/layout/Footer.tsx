import React from 'react'
import { LogoText } from '@/components/Logo/LogoText'

export default function Footer() {
    return (
        <footer className="bg-secondary/50 py-8 sm:py-10 border-t border-border">
            <div className="container mx-auto px-4">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-2 text-black dark:text-white">
                        <LogoText className="h-8 w-auto" />
                    </div>
                    <div className="text-sm text-muted-foreground">
                        © {new Date().getFullYear()} OnlyCodes. All rights reserved.
                    </div>
                </div>
            </div>
        </footer>
    )
}