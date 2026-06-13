export interface Testimonial {
  readonly id: string;
  readonly name: string;
  readonly role: string;
  readonly company: string;
  readonly text: string;
}

export const testimonials: Testimonial[] = [
  {
    id: "testimonial-1",
    name: "Colleague Name",
    role: "Engineering Manager",
    company: "Company",
    text: "An exceptional engineer who brings both technical depth and design sensibility to every project.",
  },
];