"use client"

import * as React from "react"
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react"
import { DayButton, DayPicker, getDefaultClassNames } from "react-day-picker"

import { cn } from "@/utilities/ui"
import { Button, buttonVariants } from "@/components/ui/button"

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = "label",
  buttonVariant = "ghost",
  formatters,
  components,
  ...props
}: React.ComponentProps<typeof DayPicker> & {
  buttonVariant?: React.ComponentProps<typeof Button>["variant"]
}) {
  const defaultClassNames = getDefaultClassNames()

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn(
        "bg-zinc-950 text-zinc-100 group/calendar p-5 sm:p-6 [--cell-size:2.75rem] w-full sm:w-[380px] [[data-slot=card-content]_&]:bg-transparent [[data-slot=popover-content]_&]:bg-transparent",
        String.raw`rtl:**:[.rdp-button\_next>svg]:rotate-180`,
        String.raw`rtl:**:[.rdp-button\_previous>svg]:rotate-180`,
        className
      )}
      captionLayout={captionLayout}
      formatters={{
        formatMonthDropdown: (date) =>
          date.toLocaleString("default", { month: "short" }),
        ...formatters,
      }}
      classNames={{
        root: cn("w-full sm:w-[380px]", defaultClassNames.root),
        months: cn(
          "relative flex flex-col gap-6",
          defaultClassNames.months
        ),
        month: cn("flex w-full flex-col gap-4", defaultClassNames.month),
        nav: cn(
          "absolute inset-x-0 top-0 flex w-full items-center justify-between pointer-events-none z-10",
          defaultClassNames.nav
        ),
        button_previous: cn(
          "pointer-events-auto size-9 rounded-none border border-zinc-800 bg-black text-zinc-400 hover:text-white hover:border-zinc-600 hover:bg-zinc-900 transition-colors flex items-center justify-center p-0 aria-disabled:opacity-30",
          defaultClassNames.button_previous
        ),
        button_next: cn(
          "pointer-events-auto size-9 rounded-none border border-zinc-800 bg-black text-zinc-400 hover:text-white hover:border-zinc-600 hover:bg-zinc-900 transition-colors flex items-center justify-center p-0 aria-disabled:opacity-30",
          defaultClassNames.button_next
        ),
        month_caption: cn(
          "flex h-9 w-full items-center justify-center px-12 mb-1",
          defaultClassNames.month_caption
        ),
        dropdowns: cn(
          "flex h-9 w-full items-center justify-center gap-2 font-mono text-xs uppercase tracking-wider",
          defaultClassNames.dropdowns
        ),
        dropdown_root: cn(
          "has-focus:border-odl border-zinc-800 shadow-xs has-focus:ring-odl/50 has-focus:ring-1 relative rounded-none border bg-black",
          defaultClassNames.dropdown_root
        ),
        dropdown: cn(
          "bg-zinc-950 absolute inset-0 opacity-0",
          defaultClassNames.dropdown
        ),
        caption_label: cn(
          "select-none font-mono text-sm font-medium uppercase tracking-[0.16em] text-zinc-100",
          defaultClassNames.caption_label
        ),
        month_grid: cn("w-full border-collapse mt-1", defaultClassNames.month_grid),
        weekdays: cn("flex w-full mb-2 border-b border-zinc-800/60 pb-2", defaultClassNames.weekdays),
        weekday: cn(
          "text-zinc-500 flex-1 select-none text-[11px] font-mono uppercase tracking-[0.14em] text-center font-normal",
          defaultClassNames.weekday
        ),
        week: cn("mt-2 flex w-full gap-1", defaultClassNames.week),
        week_number_header: cn(
          "w-[--cell-size] select-none font-mono text-[10px] text-zinc-600",
          defaultClassNames.week_number_header
        ),
        week_number: cn(
          "text-zinc-600 select-none text-[0.8rem] font-mono",
          defaultClassNames.week_number
        ),
        day: cn(
          "group/day relative aspect-square h-full w-full select-none p-0 text-center",
          defaultClassNames.day
        ),
        range_start: cn(
          "bg-odl text-white rounded-none",
          defaultClassNames.range_start
        ),
        range_middle: cn("bg-odl/20 text-white rounded-none", defaultClassNames.range_middle),
        range_end: cn("bg-odl text-white rounded-none", defaultClassNames.range_end),
        today: cn(
          "border border-odl/50 text-odl font-mono font-semibold rounded-none",
          defaultClassNames.today
        ),
        outside: cn(
          "text-zinc-700 opacity-40 aria-selected:text-zinc-500",
          defaultClassNames.outside
        ),
        disabled: cn(
          "text-zinc-600 opacity-30 cursor-not-allowed pointer-events-none",
          defaultClassNames.disabled
        ),
        hidden: cn("invisible", defaultClassNames.hidden),
        ...classNames,
      }}
      components={{
        Root: ({ className, rootRef, ...props }) => {
          return (
            <div
              data-slot="calendar"
              ref={rootRef}
              className={cn(className)}
              {...props}
            />
          )
        },
        Chevron: ({ className, orientation, ...props }) => {
          if (orientation === "left") {
            return (
              <ChevronLeftIcon className={cn("size-4", className)} {...props} />
            )
          }

          if (orientation === "right") {
            return (
              <ChevronRightIcon
                className={cn("size-4", className)}
                {...props}
              />
            )
          }

          return (
            <ChevronDownIcon className={cn("size-4", className)} {...props} />
          )
        },
        DayButton: CalendarDayButton,
        WeekNumber: ({ children, ...props }) => {
          return (
            <td {...props}>
              <div className="flex size-[--cell-size] items-center justify-center text-center">
                {children}
              </div>
            </td>
          )
        },
        ...components,
      }}
      {...props}
    />
  )
}

function CalendarDayButton({
  className,
  day,
  modifiers,
  ...props
}: React.ComponentProps<typeof DayButton>) {
  const defaultClassNames = getDefaultClassNames()

  const ref = React.useRef<HTMLButtonElement>(null)
  React.useEffect(() => {
    if (modifiers.focused) ref.current?.focus()
  }, [modifiers.focused])

  return (
    <Button
      ref={ref}
      variant="ghost"
      size="icon"
      data-day={day.date.toLocaleDateString()}
      data-selected-single={
        modifiers.selected &&
        !modifiers.range_start &&
        !modifiers.range_end &&
        !modifiers.range_middle
      }
      data-range-start={modifiers.range_start}
      data-range-end={modifiers.range_end}
      data-range-middle={modifiers.range_middle}
      className={cn(
        "flex aspect-square h-auto w-full min-w-[--cell-size] flex-col items-center justify-center font-mono text-sm rounded-none transition-all duration-150",
        "text-zinc-200 hover:bg-zinc-800 hover:text-white",
        "data-[selected-single=true]:bg-odl data-[selected-single=true]:text-white data-[selected-single=true]:hover:bg-odl/90 data-[selected-single=true]:font-semibold",
        "data-[range-start=true]:bg-odl data-[range-start=true]:text-white",
        "data-[range-end=true]:bg-odl data-[range-end=true]:text-white",
        "data-[range-middle=true]:bg-odl/20 data-[range-middle=true]:text-white",
        "group-data-[focused=true]/day:border-odl group-data-[focused=true]/day:ring-1 group-data-[focused=true]/day:ring-odl group-data-[focused=true]/day:relative group-data-[focused=true]/day:z-10",
        "disabled:pointer-events-none disabled:opacity-30 disabled:text-zinc-600 disabled:hover:bg-transparent disabled:hover:text-zinc-600 disabled:line-through",
        defaultClassNames.day,
        className
      )}
      {...props}
    />
  )
}

export { Calendar, CalendarDayButton }
