import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Terminal } from 'lucide-react';

interface HackEffectProps {
  onComplete: () => void;
}

const HACK_CODE = `
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <sys/socket.h>
#include <netinet/in.h>
#include <arpa/inet.h>

typedef struct {
    char host[256];
    int port;
    int status;
} connection_t;

void init_network() {
    printf("Initializing network interface...\n");
    printf("Setting up socket connections...\n");
    printf("Configuring network parameters...\n");
}

int connect_to_server(connection_t *conn) {
    printf("Connecting to %s:%d\n", conn->host, conn->port);
    printf("Establishing TCP connection...\n");
    printf("Handshake completed successfully\n");
    return 1;
}

void process_data() {
    printf("Processing incoming data stream...\n");
    printf("Parsing network packets...\n");
    printf("Validating data integrity...\n");
    printf("Storing results in buffer...\n");
}

void cleanup_connection() {
    printf("Closing network connections...\n");
    printf("Freeing allocated memory...\n");
    printf("Shutting down gracefully...\n");
}

int main(int argc, char *argv[]) {
    connection_t conn;
    
    if (argc != 3) {
        printf("Usage: %s <host> <port>\n", argv[0]);
        return 1;
    }
    
    strcpy(conn.host, argv[1]);
    conn.port = atoi(argv[2]);
    
    printf("=== NETWORK UTILITY PROGRAM ===\n");
    printf("Target: %s:%d\n", conn.host, conn.port);
    
    init_network();
    
    if (connect_to_server(&conn)) {
        printf("Connection established successfully\n");
        process_data();
        cleanup_connection();
        printf("Program completed successfully\n");
    } else {
        printf("Connection failed\n");
        return 1;
    }
    
    return 0;
}

// Additional utility functions

void log_activity(char *message) {
    printf("LOG: %s\n", message);
    printf("Timestamp: %ld\n", time(NULL));
}

void parse_config_file() {
    printf("Reading configuration file...\n");
    printf("Loading network settings...\n");
    printf("Applying user preferences...\n");
}

void monitor_bandwidth() {
    printf("Monitoring network bandwidth...\n");
    printf("Calculating throughput metrics...\n");
    printf("Generating performance reports...\n");
}

void encrypt_data(char *data) {
    printf("Applying encryption algorithm...\n");
    printf("Generating secure hash...\n");
    printf("Data encryption completed\n");
}

void validate_input(char *input) {
    printf("Validating user input...\n");
    printf("Checking parameter bounds...\n");
    printf("Input validation passed\n");
}

// File operations

void read_file(char *filename) {
    printf("Opening file: %s\n", filename);
    printf("Reading file contents...\n");
    printf("File processed successfully\n");
}

void write_log(char *entry) {
    printf("Writing to log file...\n");
    printf("Entry: %s\n", entry);
    printf("Log updated successfully\n");
}

// Memory management

void allocate_buffer(int size) {
    printf("Allocating %d bytes of memory\n", size);
    printf("Memory allocation successful\n");
}

void free_resources() {
    printf("Releasing allocated resources...\n");
    printf("Memory cleanup completed\n");
}

// String processing

void process_string(char *str) {
    printf("Processing string: %s\n", str);
    printf("String length: %lu\n", strlen(str));
    printf("String processing completed\n");
}

void format_output(char *data) {
    printf("Formatting output data...\n");
    printf("Applying text formatting...\n");
    printf("Output formatting completed\n");
}

// Network protocols

void send_http_request() {
    printf("Sending HTTP request...\n");
    printf("Setting request headers...\n");
    printf("Request sent successfully\n");
}

void parse_response() {
    printf("Parsing server response...\n");
    printf("Extracting response headers...\n");
    printf("Response parsed successfully\n");
}

// Database operations

void connect_database() {
    printf("Connecting to database...\n");
    printf("Authentication successful\n");
    printf("Database connection established\n");
}

void execute_query(char *query) {
    printf("Executing query: %s\n", query);
    printf("Query executed successfully\n");
    printf("Results retrieved\n");
}

// Configuration management

void load_settings() {
    printf("Loading application settings...\n");
    printf("Reading configuration parameters...\n");
    printf("Settings loaded successfully\n");
}

void save_preferences() {
    printf("Saving user preferences...\n");
    printf("Writing configuration file...\n");
    printf("Preferences saved successfully\n");
}

// Error handling

void handle_error(int error_code) {
    printf("Error occurred: Code %d\n", error_code);
    printf("Implementing error recovery...\n");
    printf("Error handled successfully\n");
}

void log_error(char *message) {
    printf("ERROR: %s\n", message);
    printf("Error logged to file\n");
}

// System utilities

void check_system_status() {
    printf("Checking system status...\n");
    printf("CPU usage: Normal\n");
    printf("Memory usage: Optimal\n");
    printf("System status: Healthy\n");
}

void update_system() {
    printf("Checking for updates...\n");
    printf("Downloading updates...\n");
    printf("System updated successfully\n");
}
`.trim();

export const HackEffect: React.FC<HackEffectProps> = ({ onComplete }) => {
  const [displayedCode, setDisplayedCode] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const addRandomCode = useCallback(() => {
    // Guard: Only execute if user interaction has started
    if (!hasStarted) {
      return;
    }

    if (currentIndex >= HACK_CODE.length) {
      setCurrentIndex(0);
    }

    // Add 3-8 characters at once for realistic typing speed
    const charsToAdd = Math.floor(Math.random() * 6) + 3;
    const newCode = HACK_CODE.slice(currentIndex, currentIndex + charsToAdd);
    
    setDisplayedCode(prev => {
      const updated = prev + newCode;
      // Keep only last 2000 characters to prevent memory issues
      return updated.length > 2000 ? updated.slice(-2000) : updated;
    });
    
    setCurrentIndex(prev => prev + charsToAdd);
  }, [currentIndex, hasStarted]);

  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onComplete();
      return;
    }

    // Start the effect on first user interaction
    if (!hasStarted) {
      setHasStarted(true);
    }

    // Any other key press adds code
    addRandomCode();
  }, [addRandomCode, onComplete, hasStarted]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [displayedCode]);

  return (
    <div className="fixed inset-0 z-50 bg-black text-green-400 font-mono overflow-hidden">
      {/* Header - Same as normal terminal */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-green-800 bg-gray-900">
        <div className="flex items-center gap-2">
          <Terminal size={20} />
          <span className="text-green-300">Terminal</span>
        </div>
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
      </div>

      {/* Code Display */}
      <div 
        ref={containerRef}
        className="p-4 h-[calc(100vh-64px)] overflow-y-auto text-sm leading-relaxed"
      >
        {!hasStarted && (
          <div className="text-center text-green-300 mt-20">
            <p className="text-lg mb-2">ACCESS GRANTED - WELCOME TO THE GRID</p>
            <p className="text-sm opacity-70">Press any key to start hacking... ESC to exit</p>
          </div>
        )}
        
        <pre className="whitespace-pre-wrap">
          {displayedCode}
          {hasStarted && <span className="animate-pulse bg-green-400 text-black">█</span>}
        </pre>
      </div>
    </div>
  );
};