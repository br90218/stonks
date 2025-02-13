export class DateService {
    private initialDate: string;
    private dateObj: Date;
    private dateCalculationInterval;
    constructor(date: string) {
        this.initialDate = date;
        this.dateObj = new Date(this.initialDate);
    }

    AddDay(amount = 1): void {
        const date = this.dateObj.getDate();
        this.dateObj.setDate(date + amount);
    }

    ParseDate(): string {
        return this.dateObj.toISOString().split('T')[0];
    }

    StartDateProgression(): void {
        if (this.dateCalculationInterval) {
            console.error('there exists another date calculation loop!');
            return;
        }
        const interval = setInterval(() => {
            this.AddDay();
        }, 5000);
        this.dateCalculationInterval = interval;
    }

    StopDateProgression(): void {
        if (this.dateCalculationInterval) {
            clearInterval(this.dateCalculationInterval);
        }
        this.dateCalculationInterval = undefined;
    }
}
