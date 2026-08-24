"use client";

import { featuresData } from "@/data";

import { Badge, Card, CardDescription, CardHeader, CardTitle } from "@/ui";

export function FeaturesList() {
  return (
    <section id="features" className="w-full py-16">
      <div className="container space-y-10">
        <div className="mx-auto max-w-2xl space-y-3 text-center">
          <h2 className="text-3xl font-bold tracking-tight">Full-Stack Features Out of the Box</h2>
          <p className="text-muted-foreground">
            Everything configured, tested, and integrated to build scalable full-stack applications.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featuresData.map(({ title, desc, category }) => (
            <Card key={title} className="transition-all hover:shadow-md">
              <CardHeader className="space-y-2">
                <div className="flex items-center justify-between">
                  <Badge variant="secondary">{category}</Badge>
                </div>
                <CardTitle className="text-lg font-semibold">{title}</CardTitle>
                <CardDescription className="text-sm leading-relaxed">{desc}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
