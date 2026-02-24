export class Queue {
  private readonly ids = new Set<string>();

  enqueue(id: string): void {
    this.ids.add(id);
  }

  drain(size: number): string[] {
    if (this.ids.size < size) return [];
    const out = [...this.ids].slice(0, size);
    out.forEach((id) => this.ids.delete(id));
    return out;
  }
}
