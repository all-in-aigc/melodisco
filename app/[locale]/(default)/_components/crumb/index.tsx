import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import { Nav } from "@/types/nav";

export default function ({ navs }: { navs: Nav[] }) {
  return (
    <Breadcrumb className="mb-8 text-base-content">
      <BreadcrumbList>
        {navs.map((nav: Nav, idx: number) => {
          return (
            <>
              <BreadcrumbItem className="cursor-pointer" key={idx}>
                {nav.active ? (
                  <BreadcrumbPage className="text-primary">
                    {nav.title}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink
                    className="text-base-content hover:text-primary"
                    href={nav.url}
                  >
                    {nav.title}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!nav.active && <BreadcrumbSeparator />}
            </>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
