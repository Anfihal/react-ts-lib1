// types/team.ts
export interface SocialLinks {
    linkedin?: string;
    github?: string;
    telegram?: string;
}

export interface TeamMember {
    id: string;
    name: string;
    position: string;
    description: string;
    imageUrl?: string;
    socialLinks?: SocialLinks;
}