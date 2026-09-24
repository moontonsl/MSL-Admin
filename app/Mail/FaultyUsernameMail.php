<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use App\Models\User;

class FaultyUsernameMail extends Mailable
{
    use Queueable, SerializesModels;

    public $user;
    public $issueType;
    public $issueDetails;

    /**
     * Create a new message instance.
     */
    public function __construct(User $user, string $issueType, array $issueDetails = [])
    {
        $this->user = $user;
        $this->issueType = $issueType;
        $this->issueDetails = $issueDetails;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Action Required: Update Your MSL Username',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.faulty-username-notification',
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
} 