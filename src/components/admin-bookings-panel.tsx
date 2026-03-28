import { locations } from "@/data/locations";
import { readBookingRequests } from "@/lib/booking-store";
import { euro, getBookingRevenueSnapshot } from "@/lib/utils";

export async function AdminBookingsPanel() {
  const requests = await readBookingRequests();
  const enrichedRequests = requests
    .map((request) => {
      const location = locations.find((entry) => entry.id === request.locationId);

      if (!location) {
        return null;
      }

      return {
        ...request,
        location,
        revenue: getBookingRevenueSnapshot(location, request)
      };
    })
    .filter((entry) => entry !== null);

  const totals = enrichedRequests.reduce(
    (accumulator, request) => {
      accumulator.leadValue += request.revenue.leadValue;
      accumulator.commission += request.revenue.commission;
      accumulator.estimatedTotal += request.revenue.estimatedTotal;
      return accumulator;
    },
    {
      leadValue: 0,
      commission: 0,
      estimatedTotal: 0
    }
  );

  return (
    <section className="space-y-6">
      <div className="surface rounded-[34px] border border-white/70 p-6 shadow-soft">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-ember">Internal Revenue View</p>
            <h2 className="headline mt-2 text-4xl text-slate-950">Lead Pipeline</h2>
          </div>
          <p className="max-w-2xl text-sm leading-6 text-slate-600">
            Diese Kennzahlen bleiben intern. Sie simulieren Lead-Wert und 10 % Provision auf das geschätzte Eventvolumen.
          </p>
        </div>
        <div className="mt-6 grid gap-4 lg:grid-cols-4">
          <div className="rounded-[28px] bg-slate-950 p-5 text-white">
            <p className="text-xs uppercase tracking-[0.22em] text-white/50">Leads</p>
            <p className="headline mt-3 text-4xl">{enrichedRequests.length}</p>
          </div>
          <div className="rounded-[28px] bg-white p-5">
            <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Lead Value</p>
            <p className="headline mt-3 text-4xl text-slate-950">{euro.format(totals.leadValue)}</p>
          </div>
          <div className="rounded-[28px] bg-white p-5">
            <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Provisionspotenzial</p>
            <p className="headline mt-3 text-4xl text-slate-950">{euro.format(totals.commission)}</p>
          </div>
          <div className="rounded-[28px] bg-sand p-5">
            <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Eventvolumen</p>
            <p className="headline mt-3 text-4xl text-slate-950">{euro.format(totals.estimatedTotal)}</p>
          </div>
        </div>
      </div>

      <div className="surface rounded-[34px] border border-white/70 p-6 shadow-soft">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Booking Requests</p>
            <h2 className="headline mt-2 text-4xl text-slate-950">Anfragen</h2>
          </div>
          <p className="text-sm text-slate-500">{enrichedRequests.length} gespeicherte Datensätze</p>
        </div>

        {enrichedRequests.length === 0 ? (
          <div className="rounded-[28px] border border-dashed border-slate-300 px-6 py-10 text-center">
            <p className="headline text-3xl text-slate-950">Noch keine Leads</p>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Sobald eine Schulklasse eine Anfrage absendet, taucht sie hier mit Lead-Wert und Provision auf.
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {enrichedRequests.map((request) => (
              <article
                key={request.id}
                className="rounded-[28px] border border-slate-200 bg-white/80 p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="flex flex-wrap gap-2">
                      <span className="rounded-full bg-sand px-3 py-1 text-xs font-semibold text-slate-700">
                        {request.location.placementLabel}
                      </span>
                      {request.location.featured ? (
                        <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
                          Premium Placement
                        </span>
                      ) : null}
                    </div>
                    <h3 className="headline mt-3 text-3xl text-slate-950">{request.locationName}</h3>
                    <p className="mt-1 text-sm text-slate-500">
                      {request.schoolName} · {request.name} · {request.email}
                    </p>
                  </div>
                  <div className="rounded-[24px] bg-slate-950 px-4 py-3 text-right text-white">
                    <p className="text-xs uppercase tracking-[0.18em] text-white/50">Lead Value</p>
                    <p className="mt-2 text-2xl font-semibold">{euro.format(request.revenue.leadValue)}</p>
                  </div>
                </div>

                <div className="mt-5 grid gap-4 text-sm text-slate-700 md:grid-cols-5">
                  <div className="rounded-[22px] bg-slate-50 p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Gäste</p>
                    <p className="mt-2 font-semibold">{request.guests}</p>
                  </div>
                  <div className="rounded-[22px] bg-slate-50 p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Wunschtermin</p>
                    <p className="mt-2 font-semibold">{request.preferredDate}</p>
                  </div>
                  <div className="rounded-[22px] bg-slate-50 p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Eventvolumen</p>
                    <p className="mt-2 font-semibold">{euro.format(request.revenue.estimatedTotal)}</p>
                  </div>
                  <div className="rounded-[22px] bg-slate-50 p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Provision</p>
                    <p className="mt-2 font-semibold">{euro.format(request.revenue.commission)}</p>
                  </div>
                  <div className="rounded-[22px] bg-slate-50 p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Eingang</p>
                    <p className="mt-2 font-semibold">
                      {new Intl.DateTimeFormat("de-DE", {
                        dateStyle: "medium",
                        timeStyle: "short"
                      }).format(new Date(request.createdAt))}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
