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
        "bg-surface text-text-primary group/calendar p-5 sm:p-6 [--cell-size:2.75rem] w-full sm:w-[380px] [[data-slot=card-content]_&]:bg-transparent [[data-slot=popover-content]_&]:bg-transparent",
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
          "pointer-events-auto size-9 rounded-none border border-border-default bg-surface-inset text-text-secondary hover:text-text-primary hover:border-border-default hover:bg-surface-raised transition-colors flex items-center justify-center p-0 aria-disabled:opacity-30",
          defaultClassNames.button_previous
        ),
        button_next: cn(
          "pointer-events-auto size-9 rounded-none border border-border-default bg-surface-inset text-text-secondary hover:text-text-primary hover:border-border-default hover:bg-surface-raised transition-colors flex items-center justify-center p-0 aria-disabled:opacity-30",
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
          "has-focus:border-odl border-border-default shadow-xs has-focus:ring-focus-ring/50 has-focus:ring-1 relative rounded-none border bg-surface-inset",
          defaultClassNames.dropdown_root
        ),
        dropdown: cn(
          "bg-surface absolute inset-0 opacity-0",
          defaultClassNames.dropdown
        ),
        caption_label: cn(
          "select-none font-mono text-sm font-medium uppercase tracking-[0.16em] text-text-primary",
          defaultClassNames.caption_label
        ),
        month_grid: cn("w-full border-collapse mt-1", defaultClassNames.month_grid),
        weekdays: cn("flex w-full mb-2 border-b border-border-default/60 pb-2", defaultClassNames.weekdays),
        weekday: cn(
          "text-text-muted flex-1 select-none text-[11px] font-mono uppercase tracking-[0.14em] text-center font-normal",
          defaultClassNames.weekday
        ),
        week: cn("mt-2 flex w-full gap-1", defaultClassNames.week),
        week_number_header: cn(
          "w-[--cell-size] select-none font-mono text-[10px] text-text-muted",
          defaultClassNames.week_number_header
        ),
        week_number: cn(
          "text-text-muted select-none text-[0.8rem] font-mono",
          defaultClassNames.week_number
        ),
        day: cn(
          "group/day relative aspect-square h-full w-full select-none p-0 text-center",
          defaultClassNames.day
        ),
        range_start: cn(
          "bg-odl text-text-primary rounded-none",
          defaultClassNames.range_start
        ),
        range_middle: cn("bg-odl/20 text-text-primary rounded-none", defaultClassNames.range_middle),
        range_end: cn("bg-odl text-text-primary rounded-none", defaultClassNames.range_end),
        today: cn(
          "border border-odl/50 text-odl font-mono font-semibold rounded-none",
          defaultClassNames.today
        ),
        outside: cn(
          "text-zinc-700 opacity-40 aria-selected:text-text-muted",
          defaultClassNames.outside
        ),
        disabled: cn(
          "text-text-muted opacity-30 cursor-not-allowed pointer-events-none",
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
        "text-text-primary hover:bg-surface-subtle hover:text-text-primary",
        "data-[selected-single=true]:bg-odl data-[selected-single=true]:text-text-primary data-[selected-single=true]:hover:bg-odl/90 data-[selected-single=true]:font-semibold",
        "data-[range-start=true]:bg-odl data-[range-start=true]:text-text-primary",
        "data-[range-end=true]:bg-odl data-[range-end=true]:text-text-primary",
        "data-[range-middle=true]:bg-odl/20 data-[range-middle=true]:text-text-primary",
        "group-data-[focused=true]/day:border-odl group-data-[focused=true]/day:ring-1 group-data-[focused=true]/day:ring-odl group-data-[focused=true]/day:relative group-data-[focused=true]/day:z-10",
        "disabled:pointer-events-none disabled:opacity-30 disabled:text-text-muted disabled:hover:bg-transparent disabled:hover:text-text-muted disabled:line-through",
        defaultClassNames.day,
        className
      )}
      {...props}
    />
  )
}

export { Calendar, CalendarDayButton }
