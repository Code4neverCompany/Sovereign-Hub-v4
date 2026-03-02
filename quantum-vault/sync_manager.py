import os
import time
import json
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler

class BrainSyncHandler(FileSystemEventHandler):
    def on_modified(self, event):
        if not event.is_directory and event.src_path.endswith('.json'):
            print(f"[BRAIN_SYNC] Update detected in: {event.src_path}")
            # Logic to broadcast to other agent sessions via OpenClaw Gateway hooks
            
if __name__ == "__main__":
    print("🧠 OpenClaw Brain-Sharing Manager active in /quantum-vault")
    observer = Observer()
    observer.schedule(BrainSyncHandler(), path='~/workspace/quantum-vault/_shared_memory', recursive=False)
    observer.start()
    try:
        while True: time.sleep(1)
    except KeyboardInterrupt:
        observer.stop()
    observer.join()
