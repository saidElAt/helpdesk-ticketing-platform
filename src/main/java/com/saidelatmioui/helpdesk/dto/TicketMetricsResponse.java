package com.saidelatmioui.helpdesk.dto;

public class TicketMetricsResponse {

    private long totalTickets;

    private long openTickets;
    private long inProgressTickets;
    private long resolvedTickets;
    private long closedTickets;

    private long lowPriorityTickets;
    private long mediumPriorityTickets;
    private long highPriorityTickets;
    private long criticalPriorityTickets;

    private long assignedTickets;
    private long unassignedTickets;

    public TicketMetricsResponse() {
    }

    public long getTotalTickets() {
        return totalTickets;
    }

    public void setTotalTickets(
            long totalTickets
    ) {
        this.totalTickets = totalTickets;
    }

    public long getOpenTickets() {
        return openTickets;
    }

    public void setOpenTickets(
            long openTickets
    ) {
        this.openTickets = openTickets;
    }

    public long getInProgressTickets() {
        return inProgressTickets;
    }

    public void setInProgressTickets(
            long inProgressTickets
    ) {
        this.inProgressTickets =
                inProgressTickets;
    }

    public long getResolvedTickets() {
        return resolvedTickets;
    }

    public void setResolvedTickets(
            long resolvedTickets
    ) {
        this.resolvedTickets =
                resolvedTickets;
    }

    public long getClosedTickets() {
        return closedTickets;
    }

    public void setClosedTickets(
            long closedTickets
    ) {
        this.closedTickets = closedTickets;
    }

    public long getLowPriorityTickets() {
        return lowPriorityTickets;
    }

    public void setLowPriorityTickets(
            long lowPriorityTickets
    ) {
        this.lowPriorityTickets =
                lowPriorityTickets;
    }

    public long getMediumPriorityTickets() {
        return mediumPriorityTickets;
    }

    public void setMediumPriorityTickets(
            long mediumPriorityTickets
    ) {
        this.mediumPriorityTickets =
                mediumPriorityTickets;
    }

    public long getHighPriorityTickets() {
        return highPriorityTickets;
    }

    public void setHighPriorityTickets(
            long highPriorityTickets
    ) {
        this.highPriorityTickets =
                highPriorityTickets;
    }

    public long getCriticalPriorityTickets() {
        return criticalPriorityTickets;
    }

    public void setCriticalPriorityTickets(
            long criticalPriorityTickets
    ) {
        this.criticalPriorityTickets =
                criticalPriorityTickets;
    }

    public long getAssignedTickets() {
        return assignedTickets;
    }

    public void setAssignedTickets(
            long assignedTickets
    ) {
        this.assignedTickets =
                assignedTickets;
    }

    public long getUnassignedTickets() {
        return unassignedTickets;
    }

    public void setUnassignedTickets(
            long unassignedTickets
    ) {
        this.unassignedTickets =
                unassignedTickets;
    }
}